export interface Logger {
    info(msg: string);
    warn(msg: string);
    error(msg: string);
    fatal(msg: string);
}
