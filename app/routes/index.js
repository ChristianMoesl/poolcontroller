var poolController = require('../services/PoolController/PoolController');
var express = require('express');
var router = express.Router();
var io = require('../sockets');

var ioNamespace = '/my-namespace';
var nsp = io.of('/index');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', Object.assign(
        {
            title: 'Pool Controller',
            ioNamespace: ioNamespace,
            roofTemperatureSensorName: 'Roof temperature sensor',
        },
        poolController.getStatus()
    ));
});

nsp.on('connection', function(socket){
    console.log("Connected");
    socket.on('disconnect', function(){
        console.log("Disconnected");
    });
});

poolController.on('change', function(args) {
    nsp.emit('status', args);
});

module.exports = router;
