const config = require('./config')
const { httpProxy, getFile, mml2latex } = require('./utils')
let global = {
    config: {
        errorAlertEnabled: config['ERROR_ALERT_ENABLED'],
        sentryPublicDsn: config['SENTRY_PUBLIC_DSN'],
        subject: process.env.SUBJECT
    },
    user: null
}
config.SUBJECT = process.env.SUBJECT;
if (process.env.NODE_ENV == 'development') {
    config['DEBUG'] = true;
    global.config.version = 'dev';

} else {
    config['DEBUG'] = false;
    global.config.version = 'pro';
}

exports.renderStaticMain = async (ctx, next) => {
    let values = await Promise.all([ getFile('webpack_bootstrap.js')]);
    let bootstrap = values[0];
    /*let data = values[0];
    global.userId = data.g.user._id;
    global.user = data.g.user;*/
    await ctx.render('base', {  config , global: JSON.stringify(global), bootstrap, entryjs: 'main.js' })
}

exports.renderStaticUser = async (ctx, next) => {
    let values = await Promise.all([ getFile('webpack_bootstrap.js')]);
    let bootstrap = values[0];
    /*let data = values[0];
    global.userId = data.g.user._id;
    global.user =  data.g.user*/
    await ctx.render('base', { config , global: JSON.stringify(global), bootstrap, entryjs: 'user.js' })
}
exports.renderLogin = async (ctx, next) => {
    let bootstrap = await getFile('webpack_bootstrap.js');
    await ctx.render('login', { config , global: JSON.stringify(global), bootstrap, entryjs: 'user.js' })
}

exports.renderErrorHandler = async (ctx, next) => {
    await ctx.render('error', { config, code: '404', desc: 'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.\n' })
}
exports.renderOtherError = async (ctx, next) => {
    await ctx.render('error', { code: '500' , desc: 'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.\n'})
}
exports.logOut = async (ctx, next) => {
//  ctx.cookies.set('session', '', {
//      domain: '.xdfjiaoyan.com',
//      path: '/'
//  });

    ctx.redirect('/auth/login')
}
exports.renderHome = async (ctx, next) => {
    let values = await Promise.all([getFile('webpack_bootstrap.js')]);
    let bootstrap = values[0];
   /* let data = values[0];
    global.userId = data.g.user._id;
    global.user = data.g.user*/
    await ctx.render('base', { config, global: JSON.stringify(global), bootstrap , entryjs: 'portal.js'})
}

