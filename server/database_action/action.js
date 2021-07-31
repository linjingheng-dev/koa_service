const mysql = require('mysql');
const config = require('./../config/environment/index');
const logsUtil = require('./../utils/logs');

function circulateSql(sql) {
    return new Promise(resolve => {
        const connection = mysql.createConnection(config['mysqlConfig']);
        connection.connect();
        connection.query(sql, function (error, results, fields) {
            if (error) {
                console.log(`【SQL执行失败】：${sql}，【错误信息】${error}`);
                logsUtil.logError(null, error, 0);
            } else {
                console.log(`【SQL执行成功】：${sql}`);
            }
            resolve(error ? { code: -1, data: error, fields } : {code: 0, data: JSON.stringify(results), fields});
        });
        connection.end();
    });
}

module.exports = {
    circulateSql
};