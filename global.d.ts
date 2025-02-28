declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    APP_URL: string;
  }
}