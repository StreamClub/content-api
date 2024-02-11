import winston from "winston";

class Logger {
    private static instance: Logger;
    private logger: winston.Logger;
    private production: boolean;

    private constructor(production: boolean = false) {
        this.logger = winston.createLogger({
            level: 'silly',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            transports: [
                new winston.transports.Console(),
            ],
        });
        this.production = production;
    }

    private static log(level: string, message: string): void {
        if (this.instance.production) {
            this.instance.logger.log({
                level,
                message
            });
        }
    }


    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public info(message: string): void {
        Logger.log('info', message);
    }

    public error(message: string): void {
        Logger.log('error', message);
    }

    public warn(message: string): void {
        Logger.log('warn', message);
    }

    public silly(message: string): void {
        Logger.log('silly', message);
    }

    public debug(message: string): void {
        Logger.log('debug', message);
    }

    public verbose(message: string): void {
        Logger.log('verbose', message);
    }

    public http(message: string): void {
        Logger.log('http', message);
    }

}

export const logger = Logger.getInstance();