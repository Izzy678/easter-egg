import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mood } from '../../moods/entities/mood.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  plot: string;

  @Column('text', { name: 'full_plot', nullable: true })
  fullPlot: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  runtime: number;

  @Column({ name: 'poster_url' })
  posterUrl: string;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string;

  @Column({ name: 'imdb_rating', type: 'decimal', precision: 3, scale: 1, nullable: true })
  imdbRating: number;

  @Column({ name: 'rotten_tomatoes_rating', type: 'decimal', precision: 5, scale: 2, nullable: true })
  rottenTomatoesRating: number;

  @Column('simple-array', { nullable: true })
  genres: string[];

  @Column('jsonb', { nullable: true })
  cast: any;

  @Column('simple-array', { nullable: true })
  trivia: string[];

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @ManyToMany(() => Mood, (mood) => mood.movies)
  @JoinTable({
    name: 'movie_moods',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'mood_id', referencedColumnName: 'id' },
  })
  moods: Mood[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
