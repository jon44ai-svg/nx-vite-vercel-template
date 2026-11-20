import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HealthCheck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: string;

  @CreateDateColumn()
  checkedAt!: Date;
}
