import { User } from '../users/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  const users: Partial<User>[] = [];

  beforeEach(async () => {
    fakeUsersService = {
      find: (em) =>
        Promise.resolve(users.filter(({ email }) => email === em) as User[]),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const [em, pass] = ['ben@ben.com', 'Benben@1'];

  it('creates a new user with salted ad hashed password', async () => {
    const user = await service.signUp(em, pass);

    expect(user.password).not.toEqual(pass);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with existing email', async () => {
    await expect(service.signUp(em, pass)).rejects.toThrow(BadRequestException);
  });

  it('throws error if signed with an unusual email', async () => {
    await expect(service.signIn('benben@ben.ben', 'pess')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await expect(service.signIn(em, 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct cred provided', async () => {
    const user = await service.signIn(em, pass);

    expect(user).toBeDefined();
  });
});

// it('can create an instance of auth service', async () => {
//   const fakeUsersService = {
//     find: () => Promise.resolve([]),
//     create: (email: string, password: string) =>
//       Promise.resolve({ id: 1, email, password }),
//   };

//   const module: TestingModule = await Test.createTestingModule({
//     providers: [
//       AuthService,
//       { provide: UsersService, useValue: fakeUsersService },
//     ],
//   }).compile();

//   const service = module.get<AuthService>(AuthService);

//   expect(service).toBeDefined();
// });
