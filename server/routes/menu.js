/*
 * @Description: 菜品菜单 -请求转发
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 10:47:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 15:08:30
 */

const router = require('koa-router')();
const menuController = require('./../controller/menu/menu.controller');

// 获取菜单列表
router.get('/menu/getList', menuController.getListFn);

module.exports = router;