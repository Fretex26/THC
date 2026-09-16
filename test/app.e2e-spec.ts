import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp } from './helpers/e2e-app.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const context = await createE2EApp();
    app = context.app
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET / returns 200 Hello World!', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })
});
