import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecapsController } from './recaps.controller';
import { RecapsService } from './recaps.service';
import { Recap } from './entities/recap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recap])],
  controllers: [RecapsController],
  providers: [RecapsService],
  exports: [RecapsService],
})
export class RecapsModule {}
