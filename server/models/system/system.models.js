/*
 * @Description: 系统业务逻辑
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 12:10:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 18:29:24
 */
const convert = require('./../../utils/convert.service');

class SystemModes {
    constructor() {}

    // 获取用户信息
    async getUserInfo(params = {}) {
        const body = {
            url: 'xcx/system/getUserInfo',
            method: 'POST',
            params: params
        };
        return await convert.convertService(body);
    }

    // 将用户添加到黑名单
    async addUserInBlackList(params = {}) {
        const body = {
            url: 'xcx/system/addUserToBlackList',
            method: 'POST',
            params: params
        };
        return await convert.convertService(body);
    }

    // 查询、删除黑名单
    async blackList(params = {}) {
        const body = {
            url: 'xcx/system/blackList',
            method: 'POST',
            params: params
        };
        return await convert.convertService(body);
    }

    // 接口权限表增删改查
    async getInterfaceList(params = {}) {
        const body = {
            url: 'xcx/system/getInterfaceList',
            method: 'POST',
            params: params
        };
        return await convert.convertService(body);
    }    
}

module.exports = new SystemModes();