import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood } from './entities/mood.entity';

@Injectable()
export class MoodsService {
  constructor(
    @InjectRepository(Mood)
    private moodRepository: Repository<Mood>,
  ) {}

  async findAll() {
    return this.moodRepository.find();
  }
}
