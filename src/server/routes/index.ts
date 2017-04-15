import poolController from '../PoolController';
import * as express from 'express';
import { io } from '../util/sockets';
import { log } from '../util/Log';

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
    { url: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
];

const javascripts = [
    { url: 'https://unpkg.com/core-js/client/shim.min.js' },
    { url: 'https://unpkg.com/zone.js@0.8.4?main=browser'},
    { url: 'https://unpkg.com/systemjs@0.19.39/dist/system.src.js'},
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
                title: title,
                meta: meta,
                stylesheets: stylesheets,
                javascripts: javascripts,
                ioNamespace: ioNamespace,
            },
            poolController.getStatus(),
        ));
    } else {
        next();
    }
});

export { router as routes };
