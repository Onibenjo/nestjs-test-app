import { AuthService } from './../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  const users: Partial<User>[] = [];

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve(
          (users.find((user) => user.id === id) as User) ?? (users[0] as User),
        ),
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email) as User[]),
      remove: (id: number) => {
        const newUsers = users.filter((user) => user.id === id) as User[];
        return Promise.resolve(newUsers.find((user) => user.id === id) as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        const newUsers = users.map((user) => {
          if (user.id === id) {
            Object.assign(user, attrs);
          }
          return user;
        });
        return Promise.resolve(newUsers.find((user) => user.id === id) as User);
      },
    };

    fakeAuthService = {
      signUp: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      signIn: (email: string, _password: string) =>
        Promise.resolve(users.find((user) => user.email === email) as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createUser creates user with email', async () => {
    const email = 'ben@ben.com';
    const password = 'password';
    const user = await controller.createUser({ email, password }, {});

    expect(user).toBeDefined();
  });

  it('getUsers returns list of users with email', async () => {
    const email = 'ben@ben.com';
    const users = await controller.getUsers(email);

    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0].email).toEqual(email);
  });

  it('getSingleUser returns single user with id', async () => {
    const user = await controller.getSingleUser(1);

    expect(user).toBeDefined();
  });

  it('getSingleUser returns error with invalid id', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.getSingleUser(1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signIn updates session and return user', async () => {
    const email = 'ben@ben.com';
    const password = 'password';
    const session = { userId: users.find((user) => user.email === email).id };
    const body = { email, password };
    const user = await controller.signIn(body, session);

    expect(user).toBeDefined();
    expect(session.userId).toEqual(user.id);
  });
});
