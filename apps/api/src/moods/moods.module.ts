
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodsService } from './moods.service';
import { Mood } from './entities/mood.entity';
import { MoodsController } from './moods.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Mood])],
  controllers: [MoodsController],
  providers: [MoodsService],
  exports: [MoodsService],
})
export class MoodsModule {}
