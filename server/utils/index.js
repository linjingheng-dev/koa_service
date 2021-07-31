'use strict'

/* 公共方法 */
const conf = require('./../config/environment/index');
const jwt = require('jsonwebtoken');
const systemModes = require('./../models/system/system.models');
const utils = require('./index');

// 成功响应
module.exports.resSuccess = (ctx, data) => {
    ctx.body = {
        code: 200,
        data: data ? data : null,
        msg: 'success'
    };
};

// 错误响应
module.exports.resError = (ctx, msg) => {
    ctx.body = {
        code: -1,
        data: null,
        msg: msg.message || msg
    };
}

/**
 * 判断返回值是否符合要求
 * @param { string } data python 请求回来的参数
 */
module.exports.judgeReturnValue = (data) => {
    if (data && JSON.stringify(data) !== '{}' && data['code'] === 200) {
        return {
            isTrue: true,
            data: data.data ? JSON.parse(data.data)['data'] : null
        };
    } else {
        return {
            isTrue: false,
            data: data && data['msg'] ? data['msg'] : '请求Python接口失败！'
        };
    }
}

/**
 * 签发 token
 * @param { object } data 用户信息
 */
module.exports.authenticate_signToken = (data) => {
    const currentDate = utils.timestamp(null, true)['fullDate'];
    const token = jwt.sign(
        { l_uid: data['l_id'], usearname: data['vc_account'], password: data['vc_password'], loginDate: currentDate },
        conf['secretObj']['key'],
        { expiresIn: conf['secretObj']['expires'] }
    );
    return token;
}

/**
 * 验证 token
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports.checkToken = async(ctx, next) => {
    const url = ctx.request.url;
    if (conf['urlessUrl'].indexOf(url) > -1) {
        await next();
    } else {
        let token = ctx.request.headers['authorization'];
        if (token) {
            token = token.split('Bearer ')[1];
            const decodedObj = await utils.decode(token);
            if (decodedObj['code'] === -1) {
                utils.resError(ctx, decodedObj['msg'] ? decodedObj['msg'] : '无效身份，请联系管理员提供有效身份信息！');
            } else {
                // 判断是否在黑名单中
                const result = await systemModes.blackList({ l_uid: decodedObj['data']['l_uid'], l_type: 3 });
                const resDataObj = utils.judgeReturnValue(result);
                if (resDataObj['isTrue']) {
                    const findS = resDataObj['data'].find(i => i['vc_token'] === token);
                    findS ? utils.resError(ctx, '当前用户在黑名单中，请联系管理员！') : await next();
                } else {
                    utils.resError(ctx, '身份信息有误，请联系管理员！');
                }
            }
        } else {
            utils.resError(ctx, '无效身份，请联系管理员提供有效身份信息！');
        }
    }
}

/**
 * 解密 token
 * @param { string } token 
 */
module.exports.decode = async(token) => {
    const pormiseData = await new Promise((resolve, reject) => {
        jwt.verify(token, conf['secretObj']['key'], function(err, decoded) {
            if (err) {
                resolve({
                    code: -1,
                    data: null,
                    msg: err.message || err
                });
            } else {
                resolve({
                    code: 0,
                    data: decoded,
                    msg: 'success'
                });
            }
        });
    });
    return pormiseData;
}

/**
 * 时间戳转换、当前时间
 * @param { number } tS 
 * @param { boolean } isCurrentDate 
 */
module.exports.timestamp = (tS, isCurrentDate = false) => {
    const date = !isCurrentDate ? new Date(parseInt(tS) * 1000) : new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}` < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return {
        fullDate: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
        ymd: `${year}-${month}-${day}`,
        hms: `${hour}:${minute}:${second}`,
        dateNum: Number(`${year}${month}${day}${hour}${minute}${second}`)
    };
}

/**
 * 接口权限
 */
module.exports.checkHaveInterface = async(ctx, next) => {
    const url = ctx.request.url;
    if (conf['urlessUrl'].indexOf(url) > -1) {
        await next();
    } else {
        let token = ctx.request.headers['authorization'];
        token = token.split('Bearer ')[1];
        const decodedObj = await utils.decode(token);
        const params = {
            l_type: 0,
            l_uid: decodedObj['data']['l_uid'],
            vc_shopid: null,
            vc_interfaceid: null,
            vc_fmoduleid: null,
            vc_fmodulename: null,
            vc_cmoduleid: null,
            vc_cmodulename: null,
            vc_interface: null,
            vc_node_interface: null,
            vc_interface_desc: null
        };
        const result = await systemModes.getInterfaceList(params);
        const resDataObj = utils.judgeReturnValue(result);
        if (resDataObj['isTrue'] && resDataObj['data']) {
            const findSUrl = resDataObj['data'].find(i => i['vc_node_interface'] === url);
            findSUrl ? await next() : utils.resError(ctx, `你没有访问接口 ${url} 的权限，请联系管理员！`);
        } else {
            utils.resError(ctx, `你没有访问接口 ${url} 的权限，请联系管理员！`);
        }
    }
}

exports.returnData = (res) => {
    if (!res || res.code) {
        return [];
    }
    return res || [];
}
