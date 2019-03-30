var bunyan = require('bunyan');
const Koa = require('koa')
const path = require('path')
const server = require('koa-static');
const staticCache = require('koa-static-cache')
const router = require('./routes')
const session = require('koa-session')
const render = require('koa-ejs')
const errorHandler = require('koa-better-error-handler');
const koaBunyanLogger = require('koa-bunyan-logger')
const koa404Handler = require('koa-404-handler');
const staticConfig = require('../config')
const config = require('../config')[process.env.NODE_ENV ? process.env.NODE_ENV : "development"]
var logOption = {}
const app = new Koa();
const rootPath = path.join(__dirname, '..');
let staticPath = path.join(__dirname, process.env.NODE_ENV == 'development' ? "dev" : process.env.NODE_ENV == 'test' ? "test" : "public", process.env.SUBJECT);
console.log(`staticPath is ${staticPath}`)
if (process.env.NODE_ENV == 'production') {
  logOption = {
    name: 'log',
    src: true,
    streams: [
      {
        path: path.join(rootPath, 'log', 'info.json'),
        level: 'info'
      },
      {
        path: path.join(rootPath, 'log', 'error.json'),
        level: 'error'
      },
      {
        path: path.join(rootPath, 'log', 'debug.json'),
        level: 'debug'
      },
      {
        path: path.join(rootPath, 'log', 'trace.json'),
        level: 'trace'
      },
      {
        path: path.join(rootPath, 'log', 'warn.json'),
        level: 'warn'
      },
      {
        path: path.join(rootPath, 'log', 'fatal.json'),
        level: 'fatal'
      }
    ],
    serializers: bunyan.stdSerializers
  }
}

app.context.onerror = errorHandler;

app.use(koaBunyanLogger(logOption))
app.use(koaBunyanLogger.requestLogger());
app.use(koaBunyanLogger.requestIdContext())
app.use(server(staticPath, {
  maxAge: 10 * 24 * 60 * 60,
  extensions: true,
  gzip: true
}))
//app.use(staticCache(staticPath, {
//maxAge: 10 * 24 * 60 * 60,
//gzip: true
//}))
/*app.use(staticCache(staticPath, {
  maxAge: 10 * 24 * 60 * 60,
  gzip: true,
  buffer: true,
}))*/
// local image test
//app.use(server(__dirname + '/upload'))
//app.use(staticCache(path.join(__dirname, '/upload')))
render(app, {
  root: path.join(rootPath, 'templates'),
  layout: false,
  viewExt: 'html',
  cache: process.env.NODE_ENV != 'development',
  debug: false
});

// app.use(async (ctx, next) => {
//     //let session = ctx.cookies.get('session');
//     try {
//         let whiteList = ['/auth/login', '/favicon.ico', '/500', '/404']
//
//         if (whiteList.indexOf(ctx.url) != -1) {
//             await next()
//         } else {
//             return ctx.redirect('/auth/login');
//         }
//     }catch (e) {
//         if (e.statedcode !== undefined) {
//             if (e.statedcode == -1) {
//                 return ctx.redirect('/auth/login');
//             } else {
//                 await ctx.render('error',{code: e.statedcode, desc: e.msg, config:staticConfig})
//             }	
//         }
//     }
//
// })
app.use(koa404Handler);
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config['local'][process.env.SUBJECT]['port'], () => {
  console.log('web server start at http://%s:%d', config['local'][process.env.SUBJECT]['host'], config['local'][process.env.SUBJECT]['port'])
});
