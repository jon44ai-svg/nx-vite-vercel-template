import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { AdminController } from './admin/admin.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AdminRoleGuard, JwtAuthGuard } from './auth/jwt-auth.guard';
import { validateEnv, type AppEnv } from './config/env.config';
import { HealthCheck } from './health-check.entity';
import { UserEntity } from './users/user.entity';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(HealthCheck)
    private readonly healthChecks: Repository<HealthCheck>,
  ) {}

  @Get()
  async getHealth() {
    const record = await this.healthChecks.save({ status: 'ok' });
    return {
      status: 'ok' as const,
      service: 'api-nest' as const,
      timestamp: record.checkedAt.toISOString(),
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppEnv, true>) => ({
        pinoHttp: {
          level: config.get('LOG_LEVEL', { infer: true }),
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppEnv, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN_SECONDS', { infer: true }),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppEnv, true>) => ({
        type: 'better-sqlite3' as const,
        database: config.get('DATABASE_PATH', { infer: true }),
        entities: [HealthCheck, UserEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([HealthCheck, UserEntity]),
  ],
  controllers: [HealthController, AuthController, AdminController],
  providers: [AuthService, JwtAuthGuard, AdminRoleGuard],
})
export class AppModule {}
