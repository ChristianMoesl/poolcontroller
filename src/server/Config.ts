import { Container } from 'inversify';

import { Logger } from './services/Logger';

import { log } from './util/Log';

import { SocketFactory } from './services/Socket';
import { IoSocketFactory } from './util/IoSocket';

// protocol
import { Protocol } from './protocol/Protocol';
import { SettingsRoom } from './protocol/SettingsRoom';

import * as Services from './Services';

const container = new Container();
container.bind<Logger>(Services.Logger).toConstantValue(log);
container.bind<SocketFactory>(Services.SocketFactory).to(IoSocketFactory);

container.bind<Protocol>(Protocol).to(Protocol);
container.bind<SettingsRoom>(SettingsRoom).to(SettingsRoom);

export { container };