import { User } from 'src/users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportData: CreateReportDto, user: User) {
    const report = this.repo.create(reportData);

    report.user = user;

    return this.repo.save(report);
  }

  findAll() {
    return this.repo.find();
  }
}
