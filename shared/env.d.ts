declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_GATEWAY_URL: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    SECRET_KEY: string;
    DEBUG: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
