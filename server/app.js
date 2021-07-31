const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const conf = require('./config/environment/index');
const jwt = require('koa-jwt')({ secret: conf['secretObj']['key'] });
// 路由
const router = require('./routes/index');
// 日志
const logsUtil = require('./utils/logs.js');
const utils = require('./utils');
const cors = require('koa2-cors');

// error handler
onerror(app);

// 跨域访问
app.use(cors({
    origin: function(ctx) {
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
    },
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    // maxAge: 5,
    // credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// 黑名单检验
// app.use(utils.checkToken);
// 接口权限检验
// app.use(utils.checkHaveInterface);

// app.use(jwt.unless({ path: conf.urlessUrl }));

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

// 响应日志
app.use(async(ctx, next) => {
    const start = new Date(); // 响应开始时间
    let intervals; // 响应间隔时间
    try {
        await next();
        intervals = new Date() - start;
        logsUtil.logResponse(ctx, intervals); //记录响应日志
    } catch (error) {
        intervals = new Date() - start;
        logsUtil.logError(ctx, error, intervals); //记录异常日志
    }
});

// 挂载路由
router(app);

// error-handling
app.on('error', (err, ctx) => {
    console.error('服务异常：', err, ctx);
    logsUtil.logError(ctx, err, 0); //记录异常日志
});

module.exports = app