const net = require('net');
const insertData = require('./insert_data');

// 模块引入
const socketServer = net.createServer(function (socket) {
    // 创建socket服务端
    console.log(`创建socket服务端: ${socket.remoteAddress}：${socket.remotePort}`);
    // 设置为可读流
    socket.setEncoding('binary');
    // 接收到数据
    socket.on('data', function (data) {
        console.log('接收客户端数据:' + data);
        insertData.insertData(data);
    });
    // 数据错误事件
    socket.on('error', function (exception) {
        console.log('数据接收失败:' + exception);
        socket.end();
    });
    // 客户端关闭事件
    socket.on('close', function (data) {
        console.log('客户端关闭', data);
    });
}).listen(3022);

module.exports = socketServer;