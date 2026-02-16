import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Series } from './series.entity';
import { Episode } from './episode.entity';

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'series_id' })
  seriesId: number;

  @Column({ name: 'season_number' })
  seasonNumber: number;

  @Column({ nullable: true })
  name: string;

  @Column('text', { nullable: true })
  overview: string;

  @Column({ name: 'air_date', type: 'date', nullable: true })
  airDate: Date;

  @Column({ name: 'episode_count' })
  episodeCount: number;

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string;

  @ManyToOne(() => Series, (series) => series.seasons)
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
