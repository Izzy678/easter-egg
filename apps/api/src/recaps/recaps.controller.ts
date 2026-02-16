import { Controller, Get, Param } from '@nestjs/common';
import { RecapsService } from './recaps.service';

@Controller('recaps')
export class RecapsController {
  constructor(private readonly recapsService: RecapsService) {}

  @Get('season/:seasonId')
  findBySeason(@Param('seasonId') seasonId: string) {
    return this.recapsService.findBySeason(+seasonId);
  }
}
