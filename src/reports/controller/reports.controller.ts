import { Controller, Get } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get()
  findAll() {
    return 'This action returns all reports';
  }
}
