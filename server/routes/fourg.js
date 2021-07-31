const router = require('koa-router')();
const fourgController = require('./../controller/four_g/fourg');

router.get('/fourg/list', fourgController.getWaterInfo);

module.exports = router;