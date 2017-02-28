/* eslint-env node, mocha */

import { expect } from 'chai';
/* eslint-disable */
import poolController from '../../src/server/PoolController';
/* eslint-enable */

describe('server/PoolController', () => {
    it('isn\'t initialised on startup', (done) => {
        expect(poolController.isInitialised()).to.equal(true);
        done();
    });
});

