import { log } from './util/Log';
import * as assert from 'assert';
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { createServer } from 'http';
import { io } from './util/sockets';
import * as favicon from 'serve-favicon';
import './PoolController';
const app = express();

try {
    const logStream = {
        write: (msg: string) => log.info(msg.trim()),
    };

    app.use(morgan('dev', { stream: logStream }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/images', express.static(path.join(__dirname, '/public/images')));

    /*
    *  Configure singla page application development server
    */
    if (process.env.NODE_ENV === 'development') {
        // Step 1: Create & configure a webpack compiler
        const webpack = require('webpack');
        const webpackConfig = require('./webpack.client.config');
        const compiler = webpack(webpackConfig);

        // Step 2: Attach the dev middleware to the compiler & the server
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true, publicPath: webpackConfig.output.publicPath,
        }));

        // Step 3: Attach the hot middleware to the compiler & the server
        app.use(require('webpack-hot-middleware')(compiler, {
            log: log.info, path: '/__webpack_hmr', heartbeat: 10 * 1000,
        }));

        log.info('Hot module reloading enabled');
    } else {
        log.info('Hot module reloading disabled');
    }

    app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });

    /**
     * Normalize a port into a number, string, or false.
     */
    const normalizePort = (val) => {
        const p = parseInt(val, 10);

        if (isNaN(p)) {
            // named pipe
            return val;
        }

        if (p >= 0) {
            // port number
            return p;
        }

        return false;
    };

    /**
     * Get port from environment and store in Express.
     */
    const port = normalizePort(process.env.PORT || '80');
    app.set('port', port);

    /**
     * Event listener for HTTP server "error" event.
     */
    const onError = (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? `Pipe ${port}`
            : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
        case 'EACCES':
            log.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
        }
    };

    /**
     * Event listener for HTTP server "listening" event.
     */
    const onListening = () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? `pipe ${addr}`
            : `port ${addr.port}`;
        log.info(`Listening on ${bind}`);
    };

    /**
     * Create HTTP server.
     */
    const server = createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    io.attach(server);

/**
 * Catch every exception and log it.
 */
} catch (e) {
    log.fatal(e.name);
    if (typeof e.message === 'string') {
        e.message.split('\n').forEach((line) => { log.fatal(line); });
    }
    log.fatal(e.stack);
    log.fatal('Terminating application!');
    process.exit(1);
}
