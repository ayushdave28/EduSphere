const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRE', 'JWT_COOKIE_EXPIRE'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const authCookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE);

if (Number.isNaN(authCookieExpireDays) || authCookieExpireDays <= 0) {
  throw new Error('JWT_COOKIE_EXPIRE must be a positive number of days.');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  jwtCookieExpireDays: authCookieExpireDays,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};
