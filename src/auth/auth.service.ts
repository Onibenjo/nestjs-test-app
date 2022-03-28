import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * `signUp` creates a new user with the given email and password
   * @param {string} email - The email of the user.
   * @param {string} password - The password that the user will use to login.
   * @returns The user object.
   */
  async signUp(email: string, password: string) {
    // check if the user already exist
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exist');
    }
    // Join the hash and salt and convert it to a string
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashPassword = salt + '.' + hash.toString('hex');
    //   create new user and save it
    const user = await this.usersService.create(email, hashPassword);
    // return the user
    return user;
  }

  async signIn(email: string, password: string) {
    //
  }
}
