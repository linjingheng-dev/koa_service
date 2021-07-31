/*
 * @Description: 菜品菜单 -业务请求及数据处理
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 10:40:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 15:59:36
 */

const logsUtil = require('./../../utils/logs');
const utils = require('./../../utils/index');
// const menuModels = require('./../../models/menu/menu.models');
// const database = require('./../../database_action/index');

// 获取菜单列表
module.exports.getListFn = async(ctx, next) => {
    try {
        // let returnData = await database.circulateSql([23.3, 66, 0.3, `${getDate()}`]);
        // returnData = utils.returnData(returnData);
        // utils[!returnData || returnData['code'] ? 'resError' : 'resSuccess'](ctx, returnData['data']);
        utils.resSuccess(ctx, '暂无数据');
    } catch (err) {
        logsUtil.logError(ctx, err, 0);
        utils.resError(ctx, err);
    }
}