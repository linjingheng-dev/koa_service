/**
 * @author 林景恒
 * @date 2020-07-19
 * @description 路由中间件
 */

// 业务模块入口
const menu = require('./menu');
const system = require('./system');
const fourg = require('./fourg');

module.exports = app => {
    app.use(menu.routes(), menu.allowedMethods()),
    app.use(system.routes(), system.allowedMethods())
    app.use(fourg.routes(), fourg.allowedMethods())
}