/*
 * @Description: 请求 Python 接口封装
 * @Version: 1.0
 * @Autor: 林景恒
 * @Date: 2020-07-19 14:43:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-19 21:02:28
 */


'use strict'

const koaRequest = require('koa2-request');
const logsUtil = require('./../utils/logs');
const environment = require('./../config/environment/index');

function successFn(data) {
    return {
        code: 200,
        data: data || null,
        msg: 'success'
    };
}

function errorFn(code = -1, error = null) {
    return {
        code: code,
        data: null,
        msg: error.message || error
    };
}

/**
 * 响应处理
 * @param {*} res 
 */
function resDataFn(res) {
    if (res && res.statusCode === 200) {
        const jsonRes = res.body ? JSON.parse(res.body) : null;
        if (jsonRes && (!jsonRes['code'] || jsonRes['code'] === -1)) {
            return errorFn(-1, jsonRes['msg'] ? jsonRes['msg'] : null);
        } else {
            return successFn(res.body);
        }
    } else {
        return errorFn(res.statusCode, res.body);
    }
}

/**
 * GET 请求
 * @param { string } url 
 * @param { string } data 
 */
async function get(url, data = null) {
    try {
        const res = await koaRequest({
            url: data ? `${url}?${data}` : url,
            method: 'get'
        });
        return resDataFn(res);
    } catch (error) {
        logsUtil.logError(null, error, 0);
        return errorFn(-1, error);
    }
}

/**
 * POST 请求
 * @param { string } url 
 * @param { string } data 
 */
async function post(url, data = null) {
    try {
        const res = await koaRequest({
            url: url,
            method: 'post',
            body: data
        });
        return resDataFn(res);
    } catch (error) {
        logsUtil.logError(null, error, 0);
        return errorFn(-1, error);
    }
}

/**
 * 请求入口函数
 * @param { object } params 
 */
module.exports.convertService = async(params = null) => {
    try {
        let res = null;
        const url = `${environment.baseUrl}${params['url']}`, data = urlParamFn(params);
        switch (params['method']) {
            case 'GET':
                res = await get(url, data);
                break;
            case 'POST':
                res = await post(url, data);
                break;
            case 'PUT':
                break;
            case 'PATCH':
                break;
            case 'HEAD':
                break;
            case 'DEL':
                break;
        }
        return res;
    } catch (error) {
        logsUtil.logError(null, error, 0);
        return errorFn(-1, error);
    }
}

/**
 * 参数处理
 * @param { object } params 
 */
function urlParamFn(params) {
    let data = '';
    const p = params['params'] ? params['params'] : null;
    if (params['method'] === 'GET' && p) {
        const list = [];
        for (const i in p) {
            list.push(`${i}=${p[i]}`);
        }
        data = list.join('&');
    } else if (params['method'] === 'POST' && p) {
        data = JSON.stringify(p);
    }
    return data ? data : null;
}
