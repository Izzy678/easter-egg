import { Controller, Get } from '@nestjs/common';
import { MoodsService } from './moods.service';

@Controller('moods')
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  @Get()
  findAll() {
    return this.moodsService.findAll();
  }
}
