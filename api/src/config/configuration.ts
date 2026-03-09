export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  api: {
    prefix: process.env.API_PREFIX ?? 'api',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
