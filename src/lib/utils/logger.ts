import pino from 'pino';

export const pinoLogger = pino({
  level: Bun.env.NODE_ENV === 'production' ? 'info' : 'debug',
  // transport: Bun.env.NODE_ENV === 'production' ? undefined : {
  //   target: 'pino-pretty',
  // },
}, pino.destination('./logs/app.log'));
