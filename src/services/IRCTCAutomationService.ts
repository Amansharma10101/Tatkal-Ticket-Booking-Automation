// ============================================================================
// IRCTC AUTOMATION SERVICE
// ============================================================================

import { BrowserService } from './BrowserService';
import { PDFService } from './PDFService';
import { WhatsAppService } from './WhatsAppService';
import { AppConfig, TicketData, AppError, ErrorType } from '../types';
import { logger } from '../utils/logger';

/**
 * IRCTCAutomationService class orchestrates the entire ticket booking process
 * This modernizes the original main.js with better structure and error handling
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
   * Main method to execute the complete ticket booking process
   * This orchestrates all the steps in the correct order
   */
  public async executeBooking(): Promise<void> {
    try {
      logger.info('Starting IRCTC ticket booking automation');
      
      // Step 1: Initialize browser
      await this.browserService.initialize();
      
      // Step 2: Navigate to IRCTC website
      await this.navigateToIRCTC();
      
      // Step 3: Search for trains
      await this.searchTrains();
      
      // Step 4: Select train and proceed
      await this.selectTrain();
      
      // Step 5: Login to IRCTC
      await this.loginToIRCTC();
      
      // Step 6: Fill passenger details
      await this.fillPassengerDetails();
      
      // Step 7: Fill contact details
      await this.fillContactDetails();
      
      // Step 8: Proceed to payment
      await this.proceedToPayment();
      
      // Step 9: Fill payment details
      await this.fillPaymentDetails();
      
      // Step 10: Generate PDF tickets
      await this.generateTickets();
      
      // Step 11: Send WhatsApp notifications
      await this.sendNotifications();
      
      logger.success('Ticket booking process completed successfully');
    } catch (error) {
      logger.error('Ticket booking process failed', error as Error);
      throw new AppError(
        'Ticket booking automation failed',
        ErrorType.UNKNOWN_ERROR,
        error as Error
      );
    } finally {
      // Always close the browser
      await this.browserService.close();
    }
  }

  /**
   * Navigate to IRCTC website and handle initial setup
   */
  private async navigateToIRCTC(): Promise<void> {
    try {
      logger.step(1, 11, 'Navigating to IRCTC website');
      
      await this.browserService.navigateTo(
        'https://www.irctc.co.in/nget/train-search',
        'networkidle0'
      );
      
      // Click on the search button to proceed
      await this.browserService.waitAndClick('button.btn.btn-primary');
      
      logger.success('Successfully navigated to IRCTC website');
    } catch (error) {
      logger.error('Failed to navigate to IRCTC website', error as Error);
      throw new AppError(
        'IRCTC navigation failed',
        ErrorType.NETWORK_ERROR,
        error as Error
      );
    }
  }

  /**
   * Search for trains with the specified criteria
   */
  private async searchTrains(): Promise<void> {
    try {
      logger.step(2, 11, 'Searching for trains');
      
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
      
      // Select available berth option
      await this.browserService.waitAndClick('.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c66-11.pi.pi-chevron-down');
      await this.browserService.waitAndClick('label[for="availableBerth"]');
      
      // Click search button
      await this.browserService.waitAndClick('.search_btn.train_Search');
      
      logger.success('Train search completed');
    } catch (error) {
      logger.error('Failed to search for trains', error as Error);
      throw new AppError(
        'Train search failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Select a train from the search results
   */
  private async selectTrain(): Promise<void> {
    try {
      logger.step(3, 11, 'Selecting train');
      
      // Select the first available train
      await this.browserService.waitAndClick(
        '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.ng-star-inserted > div:nth-child(5) > div > table > tr > td:nth-child(1) > div'
      );
      
      // Click book now button
      await this.browserService.waitAndClick(
        '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.col-xs-12 > div > span > span > button.btnDefault.train_Search.ng-star-inserted'
      );
      
      // Confirm booking
      await this.browserService.waitAndClick(
        '.ng-tns-c57-14.ui-confirmdialog-acceptbutton.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-icon-left.ng-star-inserted'
      );
      
      logger.success('Train selected successfully');
    } catch (error) {
      logger.error('Failed to select train', error as Error);
      throw new AppError(
        'Train selection failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Login to IRCTC with credentials
   */
  private async loginToIRCTC(): Promise<void> {
    try {
      logger.step(4, 11, 'Logging in to IRCTC');
      
      const { userId, password } = this.config.irctc;
      
      // Fill user ID
      await this.browserService.waitAndClick('#userId');
      await this.browserService.typeText('#userId', userId);
      
      // Fill password
      await this.browserService.waitAndClick('#pwd');
      await this.browserService.typeText('#pwd', password);
      
      // Wait for captcha input
      logger.info('Please enter the captcha manually');
      await this.browserService.wait(10000);
      
      // Click login button
      await this.browserService.waitAndClick('.search_btn.train_Search');
      
      logger.success('Login completed');
    } catch (error) {
      logger.error('Failed to login to IRCTC', error as Error);
      throw new AppError(
        'IRCTC login failed',
        ErrorType.AUTHENTICATION_ERROR,
        error as Error
      );
    }
  }

  /**
   * Fill passenger details for all passengers
   */
  private async fillPassengerDetails(): Promise<void> {
    try {
      logger.step(5, 11, 'Filling passenger details');
      
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
      
      logger.success('Passenger details filled successfully');
    } catch (error) {
      logger.error('Failed to fill passenger details', error as Error);
      throw new AppError(
        'Passenger details filling failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Fill contact and address details
   */
  private async fillContactDetails(): Promise<void> {
    try {
      logger.step(6, 11, 'Filling contact details');
      
      const { contactDetails } = this.config.journey;
      
      // Fill mobile number
      await this.browserService.waitAndClick('input[formcontrolname="mobileNumber"]');
      await this.browserService.typeText('input[formcontrolname="mobileNumber"]', contactDetails.contact);
      
      // Fill address
      await this.browserService.typeText('#aaa1', contactDetails.address);
      
      // Fill PIN code
      await this.browserService.typeText('input[formcontrolname="pinCode"]', contactDetails.pin);
      
      // Fill post office
      await this.browserService.waitAndClick('#address-postOffice');
      await this.browserService.typeText('#address-postOffice', 'Bhali');
      await this.browserService.getPage().keyboard.press('Enter');
      
      // Select options
      await this.browserService.waitAndClick('label[for="autoUpgradation"]');
      await this.browserService.waitAndClick('#travelInsuranceOptedYes-0 > div > div.ui-radiobutton-box.ui-widget.ui-state-default > span');
      await this.browserService.waitAndClick('.ui-radiobutton-icon.ui-clickable.pi.pi-circle-on');
      
      // Proceed
      await this.browserService.waitAndClick('.train_Search.btnDefault');
      
      logger.success('Contact details filled successfully');
    } catch (error) {
      logger.error('Failed to fill contact details', error as Error);
      throw new AppError(
        'Contact details filling failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Proceed to payment section
   */
  private async proceedToPayment(): Promise<void> {
    try {
      logger.step(7, 11, 'Proceeding to payment');
      
      // Wait for captcha
      logger.info('Please enter the captcha manually');
      await this.browserService.wait(15000);
      
      // Click proceed button
      await this.browserService.waitAndClick('.train_Search.btnDefault');
      
      // Select payment method
      await this.browserService.waitAndClick('div.col-pad.col-xs-12.bank-text');
      await this.browserService.waitAndClick('.btn.btn-primary.hidden-xs.ng-star-inserted');
      
      logger.success('Proceeded to payment section');
    } catch (error) {
      logger.error('Failed to proceed to payment', error as Error);
      throw new AppError(
        'Payment proceeding failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Fill payment details
   */
  private async fillPaymentDetails(): Promise<void> {
    try {
      logger.step(8, 11, 'Filling payment details');
      
      const { paymentDetails } = this.config.journey;
      
      // Fill card number
      await this.browserService.waitAndClick('.userCardNumber');
      await this.browserService.typeText('.userCardNumber', paymentDetails.cardNo);
      
      // Fill expiry date
      await this.browserService.waitAndClick('#validity');
      await this.browserService.typeText('#validity', paymentDetails.expiry);
      
      // Fill CVV
      await this.browserService.waitAndClick('#divCvv');
      await this.browserService.typeText('#divCvv', paymentDetails.cvv);
      
      // Fill card holder name
      await this.browserService.waitAndClick('input[name="cardName"]');
      await this.browserService.typeText('input[name="cardName"]', paymentDetails.name);
      
      // Confirm purchase
      await this.browserService.waitAndClick('#confirm-purchase');
      
      logger.success('Payment details filled successfully');
    } catch (error) {
      logger.error('Failed to fill payment details', error as Error);
      throw new AppError(
        'Payment details filling failed',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Generate PDF tickets for all passengers
   */
  private async generateTickets(): Promise<void> {
    try {
      logger.step(9, 11, 'Generating PDF tickets');
      
      const { passengers, from, to } = this.config.journey;
      const ticketsData: TicketData[] = passengers.map(passenger => ({
        passengerName: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        fromStation: from,
        toStation: to,
        transactionId: '0095562596', // Mock transaction ID
        pnrNumber: '6422380568', // Mock PNR number
      }));
      
      const generatedFiles = await this.pdfService.generateMultipleTickets(ticketsData);
      
      logger.success(`Generated ${generatedFiles.length} PDF tickets`);
    } catch (error) {
      logger.error('Failed to generate PDF tickets', error as Error);
      throw new AppError(
        'PDF ticket generation failed',
        ErrorType.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Send WhatsApp notifications to all passengers
   */
  private async sendNotifications(): Promise<void> {
    try {
      logger.step(10, 11, 'Sending WhatsApp notifications');
      
      const { passengers, from, to } = this.config.journey;
      const whatsappPage = await this.browserService.newPage();
      
      await this.whatsappService.sendMultipleNotifications(
        whatsappPage,
        passengers,
        from,
        to
      );
      
      logger.success('WhatsApp notifications sent successfully');
    } catch (error) {
      logger.error('Failed to send WhatsApp notifications', error as Error);
      throw new AppError(
        'WhatsApp notifications failed',
        ErrorType.NETWORK_ERROR,
        error as Error
      );
    }
  }
} 