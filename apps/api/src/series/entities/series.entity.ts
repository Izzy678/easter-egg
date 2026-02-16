import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Season } from './season.entity';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  plot: string;

  @Column({ name: 'first_air_date', type: 'date' })
  firstAirDate: Date;

  @Column({ name: 'last_air_date', type: 'date', nullable: true })
  lastAirDate: Date;

  @Column({ name: 'poster_url' })
  posterUrl: string;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string;

  @Column({ name: 'imdb_rating', type: 'decimal', precision: 3, scale: 1, nullable: true })
  imdbRating: number;

  @Column({ name: 'number_of_seasons' })
  numberOfSeasons: number;

  @Column({ name: 'number_of_episodes' })
  numberOfEpisodes: number;

  @Column('simple-array')
  genres: string[];

  @OneToMany(() => Season, (season) => season.series)
  seasons: Season[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
