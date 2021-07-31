/*
 * @Description: 系统相关的接口
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 10:47:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 15:08:30
 */

const router = require('koa-router')();
const systemController = require('./../controller/system/system.controller');

// 获取加密盐
router.post('/system/getSalt', systemController.getSalt);
// 登录
router.post('/system/login', systemController.login);
// 登出
router.post('/system/logout', systemController.logout)

module.exports = router;