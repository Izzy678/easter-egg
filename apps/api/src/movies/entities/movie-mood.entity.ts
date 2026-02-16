import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Mood } from '../../moods/entities/mood.entity';

@Entity('movie_moods')
export class MovieMood {
  @PrimaryColumn({ name: 'movie_id' })
  movieId: number;

  @PrimaryColumn({ name: 'mood_id' })
  moodId: number;

  @Column({ name: 'match_score', type: 'int', nullable: true })
  matchScore: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Mood)
  @JoinColumn({ name: 'mood_id' })
  mood: Mood;
}
