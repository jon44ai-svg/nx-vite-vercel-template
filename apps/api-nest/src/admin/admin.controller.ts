import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { toPublicUser } from '../auth/auth.service';
import { AdminRoleGuard, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from '../users/user.entity';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  @Get('stats')
  async getStats() {
    const [totalUsers, adminUsers] = await Promise.all([
      this.users.count(),
      this.users.count({ where: { role: 'admin' } }),
    ]);

    return {
      totalUsers,
      adminUsers,
      service: 'api-nest' as const,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  @Get('users')
  async listUsers() {
    const records = await this.users.find({ order: { createdAt: 'DESC' } });
    return records.map(toPublicUser);
  }
}
