import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikesService } from './service/likes.service';
import { LikesController } from './controller/likes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
