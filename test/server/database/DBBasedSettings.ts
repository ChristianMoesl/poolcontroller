import { container } from '../Config';
import { expect } from 'chai';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';
import { DBBasedSettings } from '../../../src/server/database/DBBasedSettings';

describe('server/database/DBBasedSettings', () => {
    let settings: DBBasedSettings;

    beforeEach(() => {
        container.snapshot();
        
        settings = container.resolve<DBBasedSettings>(DBBasedSettings);
    });

    afterEach(() => {
        container.restore();
    });

    it('has to have valid default settings', () => {
        expect(settings.getPumpIntervall()).to.be.a('number').and.not.equal(0);
        expect(settings.getPumpTime()).to.be.a('number').and.not.equal(0);
        expect(settings.getTargetTemperature()).to.be.a('number').and.not.equal(0);
        expect(settings.getTemperatureThreshold()).to.be.a('number').and.not.equal(0);
    });

    it('has to store settings', () => {
        settings.setPumpIntervall(10);
        expect(settings.getPumpIntervall()).to.equal(10);

        settings.setPumpTime(10);
        expect(settings.getPumpTime()).to.equal(10);

        settings.setTargetTemperature(10);
        expect(settings.getTargetTemperature()).to.equal(10);

        settings.setTemperatureThreshold(10);
        expect(settings.getTemperatureThreshold()).to.equal(10);
    });
});