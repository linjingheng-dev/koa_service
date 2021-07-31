const logsUtil = require('./../../utils/logs');
const utils = require('./../../utils/index');
const conf = require('./../../config/environment/index');
const systemModes = require('./../../models/system/system.models');
const cryptoJS = require('crypto-js');

// 获取加密盐
module.exports.getSalt = (ctx, next) => {
    utils.resSuccess(ctx, conf['encryptSalt']);
}

// 登录
module.exports.login = async(ctx, next) => {
    try {
        const params = ctx.request.body;
        const result = await systemModes.getUserInfo(params);
        const resDataObj = utils.judgeReturnValue(result);
        if (resDataObj['isTrue']) {
            const data = resDataObj['data'] && resDataObj['data'].length ? resDataObj['data'][0] : null;
            if (!data) {
                utils.resError(ctx, '获取用户信息失败！');
            } else {
                const mdPassword = cryptoJS.MD5(params['password']).toString();
                if (data['vc_password'] === mdPassword && data['vc_valid'] === 1) {
                    // 删除黑名单
                    const deResult = await systemModes.blackList({ l_uid: data['l_id'], l_type: 2 });
                    const delResDataObj = utils.judgeReturnValue(deResult);
                    if (delResDataObj['isTrue']) {
                        utils.resSuccess(ctx, {userInfo: data, token: utils.authenticate_signToken(data)});
                    }else {
                        utils.resError(ctx, '删除用户黑名单失败！');
                    }
                } else {
                    utils.resError(ctx, data['vc_valid'] === 1 ? '密码不正确！' : '密码已过期，请联系管理员修改！');
                }
            }
        } else {
            utils.resError(ctx, resDataObj['data'] ? resDataObj['data'] : '获取用户信息失败！');
        }
    } catch (err) {
        logsUtil.logError(ctx, err, 0);
        utils.resError(ctx, err);
    }
}

// 退出登录
module.exports.logout = async(ctx, next) => {
    try {
        const params = ctx.request.body;
        const result = await systemModes.addUserInBlackList(params);
        const resDataObj = utils.judgeReturnValue(result);
        if (resDataObj['isTrue']) {
            if (resDataObj['data'] && resDataObj['data'].length && resDataObj['data'][0]['error_code'] === '-1') {
                utils.resError(ctx, resDataObj['data'][0]['error_msg'] ? resDataObj['data'][0]['error_msg'] : '退出失败！');
            } else {
                utils.resSuccess(ctx, '退出登录成功！');
            }
        } else {
            utils.resError(ctx, resDataObj['data'] ? resDataObj['data'] : '退出失败！');
        }
    } catch (err) {
        logsUtil.logError(ctx, err, 0);
        utils.resError(ctx, err);
    }
}
