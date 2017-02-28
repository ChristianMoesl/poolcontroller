/* eslint-env node, mocha */

import { expect } from 'chai';
import Pump from '../../../src/server/hardware/Pump';

const name = 'Hello World';
const pump = new Pump(name);

describe('server/hardware/Pump', () => {
    it('has to have a name', (done) => {
        expect(pump.getName()).to.be.a('string');
        expect(pump.getName()).to.equal(name);
        done();
    });

    it('is initial off', (done) => {
        expect(pump.getState()).to.equal('off');
        done();
    });
});
