import { Module } from '@nestjs/common';
import { ReportsController } from './controller/reports.controller';
import { ReportsService } from './service/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entity/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
