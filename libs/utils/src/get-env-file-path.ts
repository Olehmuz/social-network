export const getEnvFilePath = (): string[] => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' ? ['.env.production'] : ['.env.development'];
};
