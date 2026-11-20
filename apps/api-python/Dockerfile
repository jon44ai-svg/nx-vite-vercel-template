FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim
WORKDIR /app

COPY apps/api-python/pyproject.toml ./
RUN uv sync --no-dev

COPY apps/api-python ./

ENV APP_PORT=8000
ENV DATABASE_URL=sqlite:////data/api-python.sqlite
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
