// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

import { config } from './config';
import { IRCTCAutomationService } from './services/IRCTCAutomationService';
import { logger } from './utils/logger';
import { AppError, ErrorType } from './types';

/**
 * Main function that orchestrates the entire application
 * This is the entry point that ties all services together
 */
async function main(): Promise<void> {
  try {
    logger.info('🚂 Starting IRCTC Ticket Booking Automation');
    logger.info('=============================================');
    
    // Get configuration
    const appConfig = config.getConfig();
    
    // Log configuration summary
    logger.info(`From Station: ${appConfig.journey.from}`);
    logger.info(`To Station: ${appConfig.journey.to}`);
    logger.info(`Journey Date: ${appConfig.journey.date}`);
    logger.info(`Number of Passengers: ${appConfig.journey.passengers.length}`);
    logger.info(`Browser Mode: ${appConfig.browser.headless ? 'Headless' : 'Visible'}`);
    logger.info(`WhatsApp Notifications: ${appConfig.whatsapp.enabled ? 'Enabled' : 'Disabled'}`);
    
    // Create automation service
    const automationService = new IRCTCAutomationService(appConfig);
    
    // Execute the booking process
    await automationService.executeBooking();
    
    logger.success('🎉 Ticket booking automation completed successfully!');
    logger.info('📋 Check the tickets/ folder for generated PDF tickets');
    logger.info('📱 WhatsApp notifications have been sent (if enabled)');
    
  } catch (error) {
    if (error instanceof AppError) {
      logger.error(`❌ Application Error (${error.type}): ${error.message}`, error);
    } else {
      logger.error('❌ Unexpected error occurred', error as Error);
    }
    
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
function handleShutdown(signal: string): void {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
}

// Handle process termination signals
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    logger.error('Failed to start application:', error);
    process.exit(1);
  });
}

export { main }; 