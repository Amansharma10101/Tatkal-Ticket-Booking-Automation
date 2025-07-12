// ============================================================================
// LOGGING UTILITY
// ============================================================================

import winston from 'winston';
import path from 'path';

/**
 * Logger class that provides structured logging throughout the application
 * This replaces console.log with proper logging levels and formatting
 */
export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    this.logger = this.createLogger();
  }

  /**
   * Singleton pattern for logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Create Winston logger with proper configuration
   */
  private createLogger(): winston.Logger {
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
        // Console transport for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        // File transport for errors
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(logDir, 'combined.log'),
        }),
      ],
    });
  }

  /**
   * Log info level messages
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log error level messages
   */
  public error(message: string, error?: Error, meta?: any): void {
    this.logger.error(message, { error: error?.stack, ...meta });
  }

  /**
   * Log warning level messages
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log debug level messages
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log success messages (custom level)
   */
  public success(message: string, meta?: any): void {
    this.logger.info(`✅ ${message}`, meta);
  }

  /**
   * Log step-by-step progress
   */
  public step(stepNumber: number, totalSteps: number, message: string, meta?: any): void {
    this.logger.info(`Step ${stepNumber}/${totalSteps}: ${message}`, meta);
  }
}

// Export singleton instance
export const logger = Logger.getInstance(); 