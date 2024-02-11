import winston from "winston";

class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
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
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public info(message: string): void {
        this.logger.log({
            level: 'info',
            message
        });
    }

    public error(message: string): void {
        this.logger.log({
            level: 'error',
            message
        });
    }

    public warn(message: string): void {
        this.logger.log({
            level: 'warn',
            message
        });
    }

    public silly(message: string): void {
        this.logger.log({
            level: 'silly',
            message
        });
    }

    public debug(message: string): void {
        this.logger.log({
            level: 'debug',
            message
        });
    }

    public verbose(message: string): void {
        this.logger.log({
            level: 'verbose',
            message
        });
    }

    public http(message: string): void {
        this.logger.log({
            level: 'http',
            message
        });
    }

}

export const logger = Logger.getInstance();