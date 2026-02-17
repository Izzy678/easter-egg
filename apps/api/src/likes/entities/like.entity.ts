import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

export enum LikeTargetType {
  POST = 'post',
  COMMENT = 'comment',
}

@Entity('likes')
@Unique(['userId', 'targetType', 'targetId'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: LikeTargetType,
    name: 'target_type',
  })
  targetType: LikeTargetType;

  @Column({ name: 'target_id' })
  targetId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
