/*
 * @Description: 判断当前环境是开发还是生成
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 18:03:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 21:02:41
 */

let env = process.env['NODE_ENV'] || 'production';
env = env.toLowerCase();
console.log('环境', env);
if (env === 'development') {
    module.exports = require('./development');
} else if (env === 'production') {
    module.exports = require('./production');
} else if (env === 'test') {
    module.exports = require('./test');
}