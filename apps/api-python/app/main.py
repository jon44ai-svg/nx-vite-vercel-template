from contextlib import asynccontextmanager
from datetime import UTC, datetime
from time import monotonic

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.database import UserRecord, build_session_factory
from app.logging_config import configure_logging, get_logger
from app.security import create_access_token, decode_access_token, hash_password, verify_password

STARTED_AT = monotonic()
bearer_scheme = HTTPBearer(auto_error=False)


class RegisterRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=8)
    name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: str
    password: str


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    role: str
    createdAt: str


class AuthResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
    expiresInSeconds: int
    user: UserProfile


def to_profile(user: UserRecord) -> UserProfile:
    return UserProfile(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        createdAt=user.created_at.isoformat(),
    )


def create_app(custom_settings: Settings | None = None) -> FastAPI:
    settings = custom_settings or get_settings()
    configure_logging(settings.log_level)
    logger = get_logger("api-python")
    session_factory = build_session_factory(settings.database_url)

    def seed_admin() -> None:
        with session_factory() as db:
            existing = db.scalar(select(UserRecord).where(UserRecord.email == settings.admin_email))
            if existing:
                return
            db.add(
                UserRecord(
                    email=settings.admin_email,
                    name=settings.admin_name,
                    password_hash=hash_password(settings.admin_password),
                    role="admin",
                )
            )
            db.commit()

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        seed_admin()
        logger.info("api_python_started", port=settings.app_port, env=settings.app_env)
        yield

    application = FastAPI(
        title="Modular Template Python API",
        description="FastAPI backend with uv, SQLAlchemy, structlog, and password + JWT auth.",
        version="0.2.0",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.cors_origin.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    def get_current_user(
        credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
        db: Session = Depends(get_db),
    ) -> UserRecord:
        if credentials is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing bearer token",
            )
        try:
            payload = decode_access_token(credentials.credentials, settings)
            user_id = str(payload.get("sub", ""))
        except jwt.PyJWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            ) from exc

        user = db.get(UserRecord, user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user

    def require_admin(user: UserRecord = Depends(get_current_user)) -> UserRecord:
        if user.role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
        return user

    @application.get("/health")
    def health() -> dict[str, str]:
        return {
            "status": "ok",
            "service": "api-python",
            "timestamp": datetime.now(UTC).isoformat(),
        }

    @application.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
    def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
        email = payload.email.strip().lower()
        existing = db.scalar(select(UserRecord).where(UserRecord.email == email))
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

        user = UserRecord(
            email=email,
            name=payload.name.strip(),
            password_hash=hash_password(payload.password),
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        return AuthResponse(
            accessToken=create_access_token(user, settings),
            expiresInSeconds=settings.jwt_expires_in_seconds,
            user=to_profile(user),
        )

    @application.post("/auth/login", response_model=AuthResponse)
    def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
        email = payload.email.strip().lower()
        user = db.scalar(select(UserRecord).where(UserRecord.email == email))
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        return AuthResponse(
            accessToken=create_access_token(user, settings),
            expiresInSeconds=settings.jwt_expires_in_seconds,
            user=to_profile(user),
        )

    @application.get("/auth/me", response_model=UserProfile)
    def me(user: UserRecord = Depends(get_current_user)) -> UserProfile:
        return to_profile(user)

    @application.get("/admin/stats")
    def admin_stats(
        _: UserRecord = Depends(require_admin),
        db: Session = Depends(get_db),
    ) -> dict[str, int | str]:
        total_users = db.scalar(select(func.count(UserRecord.id))) or 0
        admin_users = db.scalar(
            select(func.count(UserRecord.id)).where(UserRecord.role == "admin")
        ) or 0
        return {
            "totalUsers": int(total_users),
            "adminUsers": int(admin_users),
            "service": "api-python",
            "uptimeSeconds": int(monotonic() - STARTED_AT),
        }

    @application.get("/admin/users", response_model=list[UserProfile])
    def admin_users(
        _: UserRecord = Depends(require_admin),
        db: Session = Depends(get_db),
    ) -> list[UserProfile]:
        records = db.scalars(select(UserRecord).order_by(UserRecord.created_at.desc())).all()
        return [to_profile(record) for record in records]

    return application


app = create_app()
