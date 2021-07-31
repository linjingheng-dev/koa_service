/**
 * @author 林景恒
 * @Date 2020-07-19
 * @description 执行日志配置文件
 * @package log4js
 */

const path = require('path');

//日志根目录
const baseLogPath = path.resolve(__dirname, './../../logs');

/*报错输出日志*/
//错误日志目录、文件名、输出完整路径
const errorPath = "/error";
const errorFileName = "error";
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

/*请求数据得到响应时输出响应日志*/
//响应日志目录、文件名、输出完整路径
const responsePath = "/response";
const responseFileName = "response";
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

/*操作数据库进行增删改等敏感操作记录日志*/
//操作日志目录、文件名、输出完整路径
const handlePath = "/handle";
const handleFileName = "handle";
const handleLogPath = baseLogPath + handlePath + "/" + handleFileName;

module.exports = {
    //日志格式等设置
    appenders: {
        "rule-console": { "type": "console" },
        "errorLogger": {
            "type": "dateFile",
            "filename": errorLogPath, // 文件名
            "pattern": "-yyyy-MM-dd-hh.log", // 用于获取时间数据，同时也根据该值进行日志滚动操作
            "alwaysIncludePattern": true, // 是否在文件名末尾直接添加上时间
            "encoding": "utf-8", // 日志编码
            "maxLogSize": 10000000, // 单个日志文件最大大小，若设置该值，那么当日志大小超过时，会进行滚动
            "numBackups": 3, // 进行滚动时最多保存的文件个数
            "path": errorPath // 日志输出的路径
        },
        "resLogger": {
            "type": "dateFile",
            "filename": responseLogPath,
            "pattern": "-yyyy-MM-dd-hh.log",
            "alwaysIncludePattern": true,
            "encoding": "utf-8",
            "maxLogSize": 10000000,
            "numBackups": 3,
            "path": responsePath
        },
        "handleLogger": {
            "type": "dateFile",
            "filename": handleLogPath,
            "pattern": "-yyyy-MM-dd-hh.log",
            "alwaysIncludePattern": true,
            "encoding": "utf-8",
            "maxLogSize": 10000000,
            "numBackups": 3,
            "path": responsePath
        },
    },
    //供外部调用的名称和对应设置定义
    categories: {
        "default": { "appenders": ["rule-console"], "level": "all" },
        "resLogger": { "appenders": ["resLogger"], "level": "info" },
        "errorLogger": { "appenders": ["errorLogger"], "level": "error" },
        "handleLogger": { "appenders": ["handleLogger"], "level": "all" },
        "http": { "appenders": ["resLogger"], "level": "info" }
    },
    "baseLogPath": baseLogPath
}