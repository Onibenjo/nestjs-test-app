import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/user.entity';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  @Post()
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    //
    console.log(body);
    return this.reportsService.create(body, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  getReports() {
    return this.reportsService.findAll();
  }
}
