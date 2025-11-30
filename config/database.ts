export default ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'postgres'),
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'khandak'),
      user: env('DATABASE_USERNAME', 'khandak'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false)
        ? { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false) }
        : false,
    },
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 60000,
  },
});
