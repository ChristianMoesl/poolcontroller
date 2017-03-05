import poolController from '../PoolController';

const express = require('express');
const io = require('../util/sockets');
const log = require('../util/Log');

const router = express.Router();

const ioNamespace = '/index';
const nsp = io.of(ioNamespace);

const title = 'Pool Controller';

const meta = {
    author: 'Christian Mösl',
    description: '',
    keywords: '',
};

const stylesheets = [
    { url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' },
];

const javascripts = [
    { url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js' },
    { url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' },
    { url: 'Client.bundle.js' },
];

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
                title,
                meta,
                stylesheets,
                javascripts,
                ioNamespace,
            },
            poolController.getStatus(),
        ));
    } else {
        next();
    }
});

module.exports = router;
