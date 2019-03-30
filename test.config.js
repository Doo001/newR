module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'testMath',
            script: './server/index.js',
            log: "./log/math.log",
            env: {
                NODE_ENV: 'test',
                SUBJECT: 'math'
            }
        },
        {
            name: 'testEnglish',
            script: './server/index.js',
            log: "./log/english.log",
            env: {
                NODE_ENV: 'test',
                SUBJECT: 'english'
            }

        }
    ]
};
