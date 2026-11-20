import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import type { AppEnv } from '../config/env.config';
import { UserEntity, type UserRole } from '../users/user.entity';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export function toPublicUser(user: UserEntity): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt:
      user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
  };
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<AppEnv, true>,
  ) {}

  async onModuleInit() {
    const adminEmail = this.config.get('ADMIN_EMAIL', { infer: true });
    const existing = await this.users.findOne({ where: { email: adminEmail } });
    if (existing) return;

    const passwordHash = await hash(this.config.get('ADMIN_PASSWORD', { infer: true }), 10);
    await this.users.save(
      this.users.create({
        email: adminEmail,
        name: this.config.get('ADMIN_NAME', { infer: true }),
        passwordHash,
        role: 'admin',
      }),
    );
  }

  async register(input: { email: string; password: string; name: string }) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await hash(input.password, 10);
    const saved = await this.users.save(
      this.users.create({
        email,
        name: input.name.trim(),
        passwordHash,
        role: 'user',
      }),
    );

    return this.buildAuthResponse(saved);
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return toPublicUser(user);
  }

  async verifyToken(token: string): Promise<AuthTokenPayload> {
    try {
      return await this.jwt.verifyAsync<AuthTokenPayload>(token, {
        secret: this.config.get('JWT_SECRET', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async buildAuthResponse(user: UserEntity) {
    const expiresInSeconds = this.config.get('JWT_EXPIRES_IN_SECONDS', { infer: true });
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role } satisfies AuthTokenPayload,
      {
        secret: this.config.get('JWT_SECRET', { infer: true }),
        expiresIn: expiresInSeconds,
      },
    );

    return {
      accessToken,
      tokenType: 'Bearer' as const,
      expiresInSeconds,
      user: toPublicUser(user),
    };
  }
}
