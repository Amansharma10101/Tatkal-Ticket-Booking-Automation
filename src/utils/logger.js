const winston = require('winston');
const path = require('path');

class Logger {
  constructor() {
    this.logger = this.createLogger();
  }

  createLogger() {
    const logDir = path.join(process.cwd(), 'logs');
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'irctc-automation' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'combined.log'),
        }),
      ],
    });
  }

  info(message, meta) {
    this.logger.info(message, meta);
  }

  error(message, error, meta) {
    this.logger.error(message, { error: error && error.stack, ...meta });
  }

  warn(message, meta) {
    this.logger.warn(message, meta);
  }

  debug(message, meta) {
    this.logger.debug(message, meta);
  }

  success(message, meta) {
    this.logger.info(`✅ ${message}`, meta);
  }

  step(stepNumber, totalSteps, message, meta) {
    this.logger.info(`Step ${stepNumber}/${totalSteps}: ${message}`, meta);
  }
}

const logger = new Logger();
module.exports = { logger }; 