// Environment configuration with validation
interface Config {
  // API URLs
  DJANGO_API_URL: string;
  NESTJS_API_URL: string;
  
  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  
  // App settings
  NODE_ENV: string;
  NEXT_PUBLIC_APP_URL: string;
  
  // Security
  JWT_SECRET?: string;
  DJANGO_SECRET_KEY?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

export const config: Config = {
  // API URLs
  DJANGO_API_URL: getEnvVar('NEXT_PUBLIC_DJANGO_API_URL', 'http://localhost:8000'),
  NESTJS_API_URL: getEnvVar('NEXT_PUBLIC_NESTJS_API_URL', 'http://localhost:3001'),
  
  // Database
  DB_HOST: getEnvVar('DB_HOST', 'localhost'),
  DB_PORT: getEnvNumber('DB_PORT', 5432),
  DB_USER: getEnvVar('DB_USER', 'postgres'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', 'password'),
  DB_NAME: getEnvVar('DB_NAME', 'bus_reservation'),
  
  // App settings
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // Security (optional for frontend)
  JWT_SECRET: process.env.JWT_SECRET,
  DJANGO_SECRET_KEY: process.env.DJANGO_SECRET_KEY,
};

export default config;