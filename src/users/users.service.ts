import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  /**
   * Creates a new user with the given email and password.
   * @param {string} email - the email of the new user.
   * @param {string} password - the password of the new user.
   * @returns {Promise<User>} A promise that resolves to the new user.
   */
  create(email: string, password: string) {
    const newUser = this.userRepo.create({ email, password });

    return this.userRepo.save(newUser);
  }

  /**
   * Finds a user by their ID.
   * @param {number} id - the ID of the user to find.
   * @returns {Promise<User>} - the user with the given ID.
   */
  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepo.findOne({ id });
    // return this.userRepo.findOneBy({ id });
  }
  /**
   * Finds a user by email.
   * @param {string} email - the email of the user to find.
   * @returns {Promise<User>} - the user with the given email.
   */
  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  /**
   * Updates the user with the given id with the given attributes.
   * @param {number} id - the id of the user to update
   * @param {Partial<User>} attrs - the attributes to update the user with
   * @returns {Promise<User>}
   */
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  /**
   * Removes a user from the database.
   * @param {number} id - the id of the user to remove
   * @returns None
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.userRepo.remove(user);
  }
}
