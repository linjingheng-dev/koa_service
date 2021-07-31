/*
 * @Description: 菜品菜单 -参数配置
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 12:10:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 18:29:24
 */
const convert = require('./../../utils/convert.service');

class MenuModes {
    constructor() {}

    // 获取菜单列表
    async getMenuList(params = {}) {
        const body = {
            url: 'xcx/menu/getMenuList',
            method: 'GET',
            params: {
                type: params['type']
            }
        };
        return await convert.convertService(body);
    }
}

module.exports = new MenuModes();