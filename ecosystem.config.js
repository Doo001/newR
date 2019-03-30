module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'math',
      script: './server/index.js',
      log: "./log/math.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'math'
      }
    },
    {
      name: 'physics',
      script: './server/index.js',
      log: "./log/physics.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'physics'
      }

    },
    {
      name: 'english',
      script: './server/index.js',
      log: "./log/english.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'english'
      }

    },
    {
      name: 'chemistry',
      script: './server/index.js',
      log: "./log/chemistry.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'chemistry'
      }

    },
    {
      name: 'biology',
      script: './server/index.js',
      log: "./log/biology.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'biology'
      }

    },
    {
      name: 'chinese',
      script: './server/index.js',
      log: "./log/chinese.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'chinese'
      }

    },
    {
      name: 'polity',
      script: './server/index.js',
      log: "./log/polity.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'polity'
      }

    },
    {
      name: 'geography',
      script: './server/index.js',
      log: "./log/geography.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'geography'
      }

    },
    {
      name: 'history',
      script: './server/index.js',
      log: "./log/history.log",
      env: {
        NODE_ENV: 'production',
        SUBJECT: 'history'
      }

    },
    {
      name: 'test',
      script: './server/index.js',
      log: "./log/test.log",
      env: {
        NODE_ENV: 'test',
        SUBJECT: 'physics'
      }

    }

  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  /* deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  } */
};
