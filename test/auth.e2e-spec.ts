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
    const email = 'ben@ben.com';
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
});