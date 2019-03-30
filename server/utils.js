const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring');
const config = require('../config')[process.env.NODE_ENV ? process.env.NODE_ENV: "development"]['proxy'][process.env.SUBJECT]
exports.getFile =  function getFile(filename) {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, process.env.NODE_ENV == 'development'? "dev": process.env.NODE_ENV == 'test'? "test": "public", process.env.SUBJECT,filename), {encoding: 'utf8'}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

exports.httpProxy = function httpProxy(ctx) {
    let options = {
        host: config.host,
        port: config.port,
        path: '/user/current_user',
        method: 'GET',
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json',
            //'Cookie': ctx.request.headers.cookie,
        	"authorization":"bearer;eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiMSIsIm5hbWUiOiJnZWhvbmdiaW4iLCJ1c2VyaWQiOiI1YWNiMWQ0MDg1NDIxOTIyNzgxNDcyOGYiLCJpc3MiOiJyZXN0YXBpdXNlciIsImF1ZCI6IjA5OGY2YmNkNDYyMWQzNzNjYWRlNGU4MzI2MjdiNGY2In0.aUUlnu2MlgoU5QZpjmjHGWstl1H1wecbATbk6rtCC4c"
        }
    }
    //console.log('session is %s', ctx.request.headers.cookie)
    return new Promise((resolve, reject) => {
        let rawData = "";
        const req = http.get(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                rawData += chunk
            });
            res.on('end', () => {
                try {
                    console.log(`rawData is ${rawData}`);
                    let data = JSON.parse(rawData);
                    if (data.status == undefined || data.status != 1) {
                        reject(data)
                    } else if(data.status != undefined && data.status == 1) {
                        resolve(data.data)
                    }

                } catch (e) {
                    reject(e)
                }

            });

        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e)
        });

        req.end();
    })

}

