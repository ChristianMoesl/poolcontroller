import { expect } from 'chai';
import { useFakeTimers, spy } from 'sinon';
//import { Pump } from '../../src/hardware/Pump';

describe('server/device/Pump', () => {
    const name = 'Hello World';
    let pump: any = null;
    let clock: any = null;

    beforeEach(() => {
        pump = null;// new Pump(name);
        clock = useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('is initial off', () => {
    //    expect(pump.powerState).to.equal('off');
    });

    it('summes the operating time', () => {
    /*    expect(pump.operatingTime).to.equal(0);

        pump.turnOn();
        clock.tick(1000 * 60);
        expect(pump.operatingTime).to.be.greaterThan(59).and.below(61);

        pump.turnOff();
        clock.tick(1000 * 60);
        expect(pump.operatingTime).to.be.greaterThan(59).and.below(61);*/
    });

    it('notifies on state change', () => {
    /*    const cb = spy();
        pump.on('change', cb);

        pump.turnOn();
        expect(cb.callCount).to.equal(1);

        clock.tick(1001);
        expect(cb.callCount).to.equal(2);

        pump.turnOff();
        expect(cb.callCount).to.equal(3);*/
    });
});
