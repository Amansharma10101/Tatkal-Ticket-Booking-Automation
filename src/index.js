// ============================================================================
// MAIN ENTRY POINT - IRCTC Ticket Booking Automation (JavaScript)
// ============================================================================

require('dotenv').config();
const { config } = require('./config');
const { IRCTCAutomationService } = require('./services/IRCTCAutomationService');

async function main() {
  try {
    console.log('🚂 IRCTC Ticket Booking Automation');
    console.log('====================================');
    
    const appConfig = config.getConfig();
    
    console.log(`\n📋 Journey Details:`);
    console.log(`   From: ${appConfig.journey.from}`);
    console.log(`   To: ${appConfig.journey.to}`);
    console.log(`   Date: ${appConfig.journey.date}`);
    console.log(`   Passengers: ${appConfig.journey.passengers.length}`);
    
    const automation = new IRCTCAutomationService(appConfig);
    await automation.executeBooking();
    
    console.log('\n✅ Automation completed successfully!');
    console.log('📄 Check the tickets/ folder for PDF tickets');
    
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main(); 