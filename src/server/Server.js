debugger;   // eslint-disable-line no-debugger

const log = require('./util/Log');
const assert = require('assert');

try {
    /* eslint-disable global-require */
    require('./PoolController');
    const express = require('express');
    const path = require('path');
    const morgan = require('morgan');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const routes = require('./routes/index');
    const createServer = require('http').createServer;
    const io = require('./util/sockets');
    const favicon = require('serve-favicon');
    const app = express();
    /* eslint-enable global-require */

    // view engine setup
    app.set('views', path.join(__dirname, 'src/server/views'));
    app.set('view engine', 'ejs');

    const logStream = {
        write: (msg, encoding) => log.info(msg.trim()),
    };

    app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
    app.use(morgan('dev', { stream: logStream }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', routes);

    /*
    *  Configure singla page application development server
    */
    try {
        /* eslint-disable global-require, import/no-dynamic-require, import/no-extraneous-dependencies */
        // Step 1: Create & configure a webpack compiler
        const webpack = require('webpack');
        const webpackConfig = require(`${process.cwd()}/webpack.client.config`);
        const compiler = webpack(webpackConfig);

        // Step 2: Attach the dev middleware to the compiler & the server
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true, publicPath: webpackConfig.output.publicPath,
        }));

        // Step 3: Attach the hot middleware to the compiler & the server
        app.use(require('webpack-hot-middleware')(compiler, {
            log: log.info, path: '/__webpack_hmr', heartbeat: 10 * 1000,
        }));
        /* eslint-enable global-require, import/no-dynamic-require, import/no-extraneous-dependencies */

        log.info('Hot module reloading enabled');
    } catch (e) {
        log.info('Hot module reloading disabled');
    }

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err, req, res) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
            });
        });
    } else {
    // production error handler
    // no stacktraces leaked to user
        app.use((err, req, res) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {},
            });
        });
    }

    /**
     * Get port from environment and store in Express.
     */

    const port = normalizePort(process.env.PORT || '80');
    app.set('port', port);

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
 * Catch every exception and log it.
 */
} catch (e) {
    log.fatal(e.name);
    if (typeof e.message === 'string') {
        e.message.split('\n').forEach((line) => { log.fatal(line); });
    }
    log.fatal('Terminating application!');
    process.exit(1);
}
