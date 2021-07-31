const logsUtil = require('./../../utils/logs');
const utils = require('./../../utils/index');
const database = require('./../../database_action/index');
const moment = require('moment');

function returnOption() {
    const field = arguments[0];
    const xAxis = arguments[1];
    const series = arguments[2];
    let option;
    if (field === 'water_flow') {
        option = {
            title: {
                text: `${moment().format('YYYY年MM月DD日')},秦岭山脉溪流水流速信息`,
                subtext: '',
                x: 'center',
                y: 'top'
            },
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: series,
                type: 'line'
            }]
        }
    } else if (field === 'turbidity') {
        option = {
            title: {
                text: `${moment().format('YYYY年MM月DD日')},秦岭山脉某溪流浑浊度`,
                subtext: '',
                x: 'center'
            },
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 20,
                data: series,
                type: 'scatter'
            }]
        };
    } else if (field === 'rainfall') {
        option = {
            title: {
                text: `${moment().format('YYYY年MM月DD日')}，秦岭山脉降雨量信息`,
                subtext: '',
                x: 'center',
                y: 'bottom'
            },
            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                top: 70,
                bottom: 50
            },
            xAxis: {
                type: 'category',
                axisTick: { alignWithLabel: true },
                axisLine: { onZero: false },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return '实时降雨量 mm' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: xAxis
            },
            yAxis: { type: 'value' },
            series: {
                name: '2019-6 降雨量 mm',
                type: 'line',
                smooth: true,
                data: series
            }
        };
    }
    return option;
}

module.exports.getWaterInfo = async (ctx, next) => {
    try {
        const params = ctx.request.query;
        if (!params || !params['field']) {
            throw new Error('没有指定获取那个字段的数据');
        }
        const sql = `select * from data_file t where to_days(t.insert_date)=to_days(now()) order by t.insert_date asc`;
        let returnData = await database.circulateSql(sql);
        returnData = utils.returnData(returnData);
        let data = returnData['data'] ? JSON.parse(returnData['data']) : [];
        const xAxis = [], series = [];
        // data = data.filter(o => moment(o['insert_date']).format('YYYYMMDD') === moment().format('YYYYMMDD'));
        data.forEach(o => {
            xAxis.push(moment(o['insert_date']).format('HH:mm'));
            if (['water_flow', 'rainfall'].includes(params['field'])) {
                series.push(Number(o[params['field']] || '0'));
            } else if (params['field'] === 'turbidity') {
                series.push([Number(moment(o['insert_date']).format('HH.mm')), Number(o[params['field']] || '0')]);
            }
        });
        const option = returnOption(params['field'], xAxis, series);
        utils[!returnData || returnData['code'] ? 'resError' : 'resSuccess'](ctx, series.length ? option : {});
    } catch (err) {
        logsUtil.logError(ctx, err, 0);
        utils.resError(ctx, err);
    }
}