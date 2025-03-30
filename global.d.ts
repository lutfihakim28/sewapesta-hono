import { TestAuthData } from 'test-setup';

declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    APP_URL: string;
    DB_HOST: string;
    DB_DATABASE: string;
    DB_USER: string;
    DB_PASSWORD: string;
  }
}

declare global {
  var testAuthData: TestAuthData;
}