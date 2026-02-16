import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemType {
  MOVIE = 'movie',
  SERIES = 'series',
}

@Entity('watchlist')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    name: 'item_type',
  })
  itemType: ItemType;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ default: false })
  watched: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
