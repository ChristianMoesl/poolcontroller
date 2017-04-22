import 'reflect-metadata';
import { inject, injectable, Container } from 'inversify';

const SERVICES = {
    Logger: Symbol('Logger'),
}

interface Logger {
    info(msg: string);
}

@injectable()
class BasicLogger implements Logger {
    info(msg: string) {
        console.log(msg);
    }
}

@injectable()
class ExtendedLogger implements Logger {
    info(msg: string) {
        console.log(`Extended: ${msg}`);
    }
}

@injectable()
class NeedsLogger {
    constructor(@inject(SERVICES.Logger) private logger: Logger) { }

    run() {
        this.logger.info('Hello World');
    }
}

const container = new Container();
container.bind<Logger>(SERVICES.Logger).to(ExtendedLogger);

const n = container.resolve<NeedsLogger>(NeedsLogger);

n.run();