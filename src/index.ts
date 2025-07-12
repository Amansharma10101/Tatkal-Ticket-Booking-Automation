// ============================================================================
// MAIN ENTRY POINT - IRCTC Ticket Booking Automation
// ============================================================================

import { config } from './config';
import { IRCTCAutomationService } from './services/IRCTCAutomationService';
import { logger } from './utils/logger';

/**
 * Main function - Entry point of the application
 * This demonstrates the complete automation workflow
 */
async function main(): Promise<void> {
  try {
    console.log('🚂 IRCTC Ticket Booking Automation');
    console.log('====================================');
    
    // Get configuration
    const appConfig = config.getConfig();
    
    // Display journey details
    console.log(`\n📋 Journey Details:`);
    console.log(`   From: ${appConfig.journey.from}`);
    console.log(`   To: ${appConfig.journey.to}`);
    console.log(`   Date: ${appConfig.journey.date}`);
    console.log(`   Passengers: ${appConfig.journey.passengers.length}`);
    
    // Create and run automation
    const automation = new IRCTCAutomationService(appConfig);
    await automation.executeBooking();
    
    console.log('\n✅ Automation completed successfully!');
    console.log('📄 Check the tickets/ folder for PDF tickets');
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Start the application
main(); 