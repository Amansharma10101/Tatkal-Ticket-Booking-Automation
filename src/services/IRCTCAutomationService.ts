// ============================================================================
// IRCTC AUTOMATION SERVICE
// ============================================================================

import { BrowserService } from './BrowserService';
import { PDFService } from './PDFService';
import { WhatsAppService } from './WhatsAppService';
import { AppConfig, TicketData } from '../types';

/**
 * IRCTC Automation Service
 * Handles the complete ticket booking process step by step
 */
export class IRCTCAutomationService {
  private browserService: BrowserService;
  private pdfService: PDFService;
  private whatsappService: WhatsAppService;
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.browserService = new BrowserService(config.browser);
    this.pdfService = new PDFService();
    this.whatsappService = new WhatsAppService(config.whatsapp);
  }

  /**
   * Execute the complete booking process
   */
  public async executeBooking(): Promise<void> {
    try {
      console.log('\n🔄 Starting automation...');
      
      // Step 1: Initialize browser
      await this.browserService.initialize();
      console.log('✅ Browser initialized');
      
      // Step 2: Navigate to IRCTC
      await this.navigateToIRCTC();
      console.log('✅ Navigated to IRCTC website');
      
      // Step 3: Search for trains
      await this.searchTrains();
      console.log('✅ Train search completed');
      
      // Step 4: Select train
      await this.selectTrain();
      console.log('✅ Train selected');
      
      // Step 5: Login
      await this.loginToIRCTC();
      console.log('✅ Login completed');
      
      // Step 6: Fill passenger details
      await this.fillPassengerDetails();
      console.log('✅ Passenger details filled');
      
      // Step 7: Fill contact details
      await this.fillContactDetails();
      console.log('✅ Contact details filled');
      
      // Step 8: Proceed to payment
      await this.proceedToPayment();
      console.log('✅ Payment section reached');
      
      // Step 9: Fill payment details
      await this.fillPaymentDetails();
      console.log('✅ Payment details filled');
      
      // Step 10: Generate tickets
      await this.generateTickets();
      console.log('✅ PDF tickets generated');
      
      // Step 11: Send notifications
      await this.sendNotifications();
      console.log('✅ Notifications sent');
      
    } catch (error) {
      console.error('❌ Automation failed:', error instanceof Error ? error.message : error);
      throw error;
    } finally {
      await this.browserService.close();
    }
  }

  /**
   * Navigate to IRCTC website
   */
  private async navigateToIRCTC(): Promise<void> {
    await this.browserService.navigateTo(
      'https://www.irctc.co.in/nget/train-search',
      'networkidle0'
    );
    await this.browserService.waitAndClick('button.btn.btn-primary');
  }

  /**
   * Search for trains
   */
  private async searchTrains(): Promise<void> {
    const { from, to, date } = this.config.journey;
    
    // Fill from station
    await this.browserService.typeText(
      'input[aria-controls="pr_id_1_list"]',
      from
    );
    
    // Fill to station
    await this.browserService.typeText(
      'input[aria-controls="pr_id_2_list"]',
      to
    );
    
    // Fill date
    await this.browserService.waitAndClick('.ng-tns-c59-10.ui-calendar');
    await this.browserService.getPage().keyboard.down('Control');
    await this.browserService.getPage().keyboard.press('a');
    await this.browserService.getPage().keyboard.up('Control');
    await this.browserService.typeText('.ng-tns-c59-10.ui-calendar', date);
    
    // Select options and search
    await this.browserService.waitAndClick('.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c66-11.pi.pi-chevron-down');
    await this.browserService.waitAndClick('label[for="availableBerth"]');
    await this.browserService.waitAndClick('.search_btn.train_Search');
  }

  /**
   * Select a train from results
   */
  private async selectTrain(): Promise<void> {
    // Select first available train
    await this.browserService.waitAndClick(
      '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.ng-star-inserted > div:nth-child(5) > div > table > tr > td:nth-child(1) > div'
    );
    
    // Click book now
    await this.browserService.waitAndClick(
      '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.col-xs-12 > div > span > span > button.btnDefault.train_Search.ng-star-inserted'
    );
    
    // Confirm booking
    await this.browserService.waitAndClick(
      '.ng-tns-c57-14.ui-confirmdialog-acceptbutton.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-icon-left.ng-star-inserted'
    );
  }

  /**
   * Login to IRCTC
   */
  private async loginToIRCTC(): Promise<void> {
    const { userId, password } = this.config.irctc;
    
    // Fill credentials
    await this.browserService.waitAndClick('#userId');
    await this.browserService.typeText('#userId', userId);
    
    await this.browserService.waitAndClick('#pwd');
    await this.browserService.typeText('#pwd', password);
    
    // Wait for manual captcha input
    console.log('⏳ Please enter the captcha manually...');
    await this.browserService.wait(10000);
    
    // Click login
    await this.browserService.waitAndClick('.search_btn.train_Search');
  }

  /**
   * Fill passenger details
   */
  private async fillPassengerDetails(): Promise<void> {
    const { passengers } = this.config.journey;
    
    // Add passengers if needed
    for (let i = 1; i < passengers.length; i++) {
      await this.browserService.waitAndClick(
        '#ui-panel-12-content > div > div.form-group.col-xs-12.padding.ng-tns-c79-64 > div.pull-left.ng-star-inserted > a > span'
      );
    }
    
    // Fill details for each passenger
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      const passengerIndex = i + 1;
      
      // Fill name
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-3.col-xs-12 > p-autocomplete > span > input`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-3.col-xs-12 > p-autocomplete > span > input`,
        passenger.name
      );
      
      // Fill age
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-1.col-xs-6 > input`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-1.col-xs-6 > input`,
        passenger.age
      );
      
      // Fill gender
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-2.col-xs-6 > select`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-2.col-xs-6 > select`,
        passenger.gender
      );
      await this.browserService.getPage().keyboard.press('Enter');
    }
  }

  /**
   * Fill contact details
   */
  private async fillContactDetails(): Promise<void> {
    const { contactDetails } = this.config.journey;
    
    // Fill contact information
    await this.browserService.waitAndClick('input[formcontrolname="mobileNumber"]');
    await this.browserService.typeText('input[formcontrolname="mobileNumber"]', contactDetails.contact);
    
    await this.browserService.typeText('#aaa1', contactDetails.address);
    await this.browserService.typeText('input[formcontrolname="pinCode"]', contactDetails.pin);
    
    await this.browserService.waitAndClick('#address-postOffice');
    await this.browserService.typeText('#address-postOffice', 'Bhali');
    await this.browserService.getPage().keyboard.press('Enter');
    
    // Select options
    await this.browserService.waitAndClick('label[for="autoUpgradation"]');
    await this.browserService.waitAndClick('#travelInsuranceOptedYes-0 > div > div.ui-radiobutton-box.ui-widget.ui-state-default > span');
    await this.browserService.waitAndClick('.ui-radiobutton-icon.ui-clickable.pi.pi-circle-on');
    
    // Proceed
    await this.browserService.waitAndClick('.train_Search.btnDefault');
  }

  /**
   * Proceed to payment
   */
  private async proceedToPayment(): Promise<void> {
    console.log('⏳ Please enter the captcha manually...');
    await this.browserService.wait(15000);
    
    await this.browserService.waitAndClick('.train_Search.btnDefault');
    await this.browserService.waitAndClick('div.col-pad.col-xs-12.bank-text');
    await this.browserService.waitAndClick('.btn.btn-primary.hidden-xs.ng-star-inserted');
  }

  /**
   * Fill payment details
   */
  private async fillPaymentDetails(): Promise<void> {
    const { paymentDetails } = this.config.journey;
    
    // Fill payment information
    await this.browserService.waitAndClick('.userCardNumber');
    await this.browserService.typeText('.userCardNumber', paymentDetails.cardNo);
    
    await this.browserService.waitAndClick('#validity');
    await this.browserService.typeText('#validity', paymentDetails.expiry);
    
    await this.browserService.waitAndClick('#divCvv');
    await this.browserService.typeText('#divCvv', paymentDetails.cvv);
    
    await this.browserService.waitAndClick('input[name="cardName"]');
    await this.browserService.typeText('input[name="cardName"]', paymentDetails.name);
    
    // Confirm purchase
    await this.browserService.waitAndClick('#confirm-purchase');
  }

  /**
   * Generate PDF tickets
   */
  private async generateTickets(): Promise<void> {
    const { passengers, from, to } = this.config.journey;
    const ticketsData: TicketData[] = passengers.map(passenger => ({
      passengerName: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      fromStation: from,
      toStation: to,
      transactionId: '0095562596',
      pnrNumber: '6422380568',
    }));
    
    await this.pdfService.generateMultipleTickets(ticketsData);
  }

  /**
   * Send WhatsApp notifications
   */
  private async sendNotifications(): Promise<void> {
    const { passengers, from, to } = this.config.journey;
    const whatsappPage = await this.browserService.newPage();
    
    await this.whatsappService.sendMultipleNotifications(
      whatsappPage,
      passengers,
      from,
      to
    );
  }
} 