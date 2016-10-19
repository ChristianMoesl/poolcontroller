var poolController = require('../controller/pool-controller');
var express = require('express');
var router = express.Router();
var io = require('../sockets');

var ioNamespace = '/my-namespace';
var nsp = io.of('/index');

var tempSensor = poolController.roofTempSensor;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'PoolController',
        temperature: tempSensor.getTemperature(),
        ioNamespace: ioNamespace
    });
});

nsp.on('connection', function(socket){
    console.log("Connected");
    socket.on('disconnect', function(){
        console.log("Disconnected");
    });
});

tempSensor.temperatureChanged.push(function(temperature) {
    nsp.emit('status', temperature);
});

module.exports = router;
