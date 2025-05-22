export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongoUri: process.env.MONGODB_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL ?? '1h',
    refreshTtlDays: 7,
  },
});
