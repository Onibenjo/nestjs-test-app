import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle signup request', () => {
    const email = 'be2n@ben.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { email, id } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as new user and get current user', async () => {
    const email = 'be3n@ben.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'password' })
      .expect(201);
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
    expect(body.email).not.toEqual('email');
  });
});
