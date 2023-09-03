import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { faker } from '@faker-js/faker';

export const generateStrongPassword = () => {
  const length = 12;
  const symbols = true;
  const numbers = true;
  const lowercase = true;
  const uppercase = true;
  const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
  let password = '';
  
  while (password.length < length) {
    const char = validChars[Math.floor(Math.random() * validChars.length)];
    password += char;
  }                             
  
  return password;
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /users/sign-up => should create a new user', async () => {
    const userDto = {
      email: faker.internet.email(),
      password: generateStrongPassword(),
    };

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userDto)
      .expect(HttpStatus.CREATED);

    expect(response.body.email).toBe(userDto.email);
  });

  it('POST /users/sign-up => should return 409 when email is already in use', async () => {
    const existingUser = {
      email: faker.internet.email(),
      password: generateStrongPassword(),
    };

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(existingUser)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(existingUser)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toBe('Email already in use');
  });

  it('POST /users/sign-up => should return 400 for weak password', async () => {
    const userDto = {
      email: faker.internet.email(),
      password: 'weak', // Password deliberately weak
    };

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toContain("Password must meet security requirements");
  });

  it('POST /users/sign-in => should authenticate user and return token', async () => {
    const userDto = {
      email: faker.internet.email(),
      password: generateStrongPassword(),
    };

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userDto)
      .expect(HttpStatus.CREATED);

    const loginDto = {
      email: userDto.email,
      password: userDto.password,
    };

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(loginDto)
      .expect(HttpStatus.OK);

    expect(response.body.accessToken).toBeTruthy();
  });

  it('POST /users/sign-in => should return 401 for invalid credentials', async () => {
    const userDto = {
      email: faker.internet.email(),
      password: generateStrongPassword(),
    };

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userDto)
      .expect(HttpStatus.CREATED);

    const invalidLoginDto = {
      email: userDto.email,
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(invalidLoginDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Invalid credentials');
  });

  afterAll(async () => {
    await app.close();
  });
});
