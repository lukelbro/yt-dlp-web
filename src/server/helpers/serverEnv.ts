import 'server-only';

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is not set.`);
};

export const serverEnv = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT'),
  HOST: getEnv('HOST'),
  PODCAST_PORT: getEnv('PODCAST_PORT', '3001'),
  // Add other server-side environment variables here
};
