/* eslint-env node, mocha */

process.env.DB_HOST = 'localhost:27017';
process.env.DEBUG = 'PoolController:*';
process.env.NODE_ENV = 'development';

/* eslint-disable */
import poolController from '../../src/server/PoolController';
/* eslint-enable */

describe('PoolController', () => {
    it('adsa', (done) => {
        if (poolController.isInitialised()) {
            done();
        } else {
            done();
        }
    });
    it('dadsa', (done) => {
        done();
    });
});

