/*
 * @Description: 生产环境配置参数
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 18:04:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 21:01:56
 */

module.exports = {
    // 不需要通过 token 认证的接口
    urlessUrl: [
        '/public', '/system/login', '/system/getSalt'
    ],
    // token 签发
    secretObj: {
        key: '#$linWu@GZ#CS2014',
        expires: 24 * 60 * 60
    },
    // 加密盐
    encryptSalt: '@#$20200801@lin_wu@',
    // python 请求地址
    baseUrl: 'http://127.0.0.1:8080/',
    mysqlConfig: {
        host: 'mysql_node',
        user: 'root',
        password: '123456',
        database: 'data',
        port: 3306
    }
};