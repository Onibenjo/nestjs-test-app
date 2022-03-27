import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(email: string, password: string) {
    const newUser = this.userRepo.create({ email, password });

    return this.userRepo.save(newUser);
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }
  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }
  // update
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }
  // remove
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.userRepo.remove(user);
  }
}
