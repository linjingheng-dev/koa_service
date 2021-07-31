const database = require('./../database_action/index');
const logsUtil = require('./../utils/logs');
const moment = require('moment');

async function dataHandle(str) {
    if (!str) {
        return;
    }
    const newStr = str.replace(/\r\n/g, ',');
    const strList = newStr.split(',');
    let data = [], r = 0;
    const rData = [];
    for (let i = 0; i < strList.length; i++) {
        if (data.length === 3) {
            const insertData = [...data];
            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const sql = `insert into data_file (water_flow, turbidity, rainfall, insert_date) values (${insertData.join(',')}, '${currentTime}')`;
            let returnData = await database.circulateSql(sql);
            rData.push({
                row: r + 1, data: returnData
            });
            data = [];
            r++;
        }
        if (strList[i]) {
            const values = strList[i].split('=');
            data.push(values[1]);
        }
    }
    return { code: 0, data: JSON.stringify(rData) };
}

exports.insertData = async (data) => {
    try {
        const rData = await dataHandle(data);
        console.log('完成插入>>>', rData);
        if (!rData) {
            throw new Error('没有可运行的数据插入');
        }
    } catch (err) {
        console.log('接收4G模块数据插入数据库失败', err);
        logsUtil.logError(null, err, 0);
    }
}