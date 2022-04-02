import { User } from '../users/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  async updateApproval(id, approved) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year } = estimateDto;
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .getRawMany();
  }

  async getAllReports() {
    return this.repo.find();
  }
}
