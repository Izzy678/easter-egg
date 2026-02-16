import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Season } from './season.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'season_id' })
  seasonId: number;

  @Column({ name: 'episode_number' })
  episodeNumber: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  overview: string;

  @Column({ name: 'air_date', type: 'date', nullable: true })
  airDate: Date;

  @Column({ nullable: true })
  runtime: number;

  @ManyToOne(() => Season, (season) => season.episodes)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
