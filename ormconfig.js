const config = {
  entities: ['**/*.entity.js'],
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    // config.host = 'db.sqlite';
    // config.user = 'root';
    // config.password = 'root';
    config.database = 'db.sqlite';
    config.type = 'sqlite';
    config.synchronize = true;
    break;
  case 'test':
    // config.host = 'test.sqlite';
    // config.user = 'root';
    // config.password = 'root';
    config.database = 'test.sqlite';
    config.type = 'sqlite';
    break;
  case 'production':
    // config.host = 'test.sqlite';
    // config.user = 'root';
    // config.password = 'root';
    config.database = 'test.sqlite';
    config.type = 'pg';
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = config;
