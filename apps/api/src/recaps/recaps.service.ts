import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recap } from './entities/recap.entity';

@Injectable()
export class RecapsService {
  constructor(
    @InjectRepository(Recap)
    private recapRepository: Repository<Recap>,
  ) {}

  async findBySeason(seasonId: number) {
    return this.recapRepository.findOne({
      where: { seasonId },
    });
  }
}
