declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    PORT: number;
    TOKEN_SECRET: string;
  }
}
