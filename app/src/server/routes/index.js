import poolController from '../PoolController';

const express = require('express');
const io = require('../util/sockets');
const log = require('../util/Log');

const router = express.Router();

const ioNamespace = '/index';
const nsp = io.of(ioNamespace);


nsp.on('connection', (socket) => {
    log.info(`Connected to namespace: ${ioNamespace}`);
    socket.on('disconnect', () => {
        log.info(`Disconnected from namespace: ${ioNamespace}`);
    });
});

poolController.on('change', (args) => {
    nsp.emit('status', args);
});

/* GET home page. */
router.get('/', (req, res, next) => {
    if (poolController.isInitialised()) {
        res.render('index', Object.assign(
            {
                title: 'Pool Controller',
                ioNamespace,
                roofTemperatureSensorName: 'Roof temperature sensor',
            },
            poolController.getStatus(),
        ));
    } else {
        next();
    }
});

module.exports = router;
