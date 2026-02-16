import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Season } from '../../series/entities/season.entity';

@Entity('recaps')
export class Recap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'season_id' })
  seasonId: number;

  @Column('text')
  content: string;

  @Column('simple-array', { name: 'key_plot_points', nullable: true })
  keyPlotPoints: string[];

  @Column({ name: 'has_spoilers', default: true })
  hasSpoilers: boolean;

  @ManyToOne(() => Season)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
