import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ItemType } from '../../watchlist/entities/watchlist.entity';
import { User } from 'src/user/entity/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  /** Nullable so synchronize does not add NOT NULL when existing rows have null user_id. */
  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId: string | null;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    name: 'item_type',
  })
  itemType: ItemType;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'item_name', type: 'varchar', length: 500, nullable: true })
  itemName: string | null;

  @Column({ name: 'item_image_url', type: 'varchar', length: 500, nullable: true })
  itemImageUrl: string | null;

  @Column('simple-array', { nullable: true, default: '' })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
