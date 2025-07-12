// ============================================================================
// WHATSAPP NOTIFICATION SERVICE
// ============================================================================

import { Page } from 'puppeteer';
import { WhatsAppConfig, AppError, ErrorType } from '../types';
import { logger } from '../utils/logger';

/**
 * WhatsAppService class handles all WhatsApp notification operations
 * This modernizes the original WhatsApp integration with better error handling
 */
export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  /**
   * Send WhatsApp notification to a passenger
   * This improves the original WhatsApp notification with better error handling
   */
  public async sendNotification(
    page: Page, 
    passengerName: string, 
    fromStation: string, 
    toStation: string
  ): Promise<void> {
    if (!this.config.enabled) {
      logger.info('WhatsApp notifications are disabled');
      return;
    }

    try {
      logger.info(`Sending WhatsApp notification to: ${passengerName}`);
      
      // Navigate to WhatsApp Web
      await page.goto('https://web.whatsapp.com/', { 
        waitUntil: 'networkidle0',
        timeout: this.config.timeout 
      });

      // Wait for WhatsApp Web to load
      await this.waitForWhatsAppLoad(page);

      // Search for the contact
      await this.searchContact(page, passengerName);

      // Send the message
      await this.sendMessage(page, passengerName, fromStation, toStation);

      logger.success(`WhatsApp notification sent to: ${passengerName}`);
    } catch (error) {
      logger.error(`Failed to send WhatsApp notification to ${passengerName}`, error as Error);
      throw new AppError(
        `WhatsApp notification failed for ${passengerName}`,
        ErrorType.NETWORK_ERROR,
        error as Error
      );
    }
  }

  /**
   * Wait for WhatsApp Web to fully load
   * This ensures the page is ready for interaction
   */
  private async waitForWhatsAppLoad(page: Page): Promise<void> {
    try {
      // Wait for the main chat list to load
      await page.waitForSelector('div[data-testid="chat-list"]', { 
        timeout: this.config.timeout 
      });
      
      logger.debug('WhatsApp Web loaded successfully');
    } catch (error) {
      logger.error('Failed to load WhatsApp Web', error as Error);
      throw new AppError(
        'WhatsApp Web failed to load',
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Search for a contact in WhatsApp
   * This improves the original contact search
   */
  private async searchContact(page: Page, contactName: string): Promise<void> {
    try {
      // Click on the search box
      const searchSelector = 'div[data-testid="chat-list-search"]';
      await page.waitForSelector(searchSelector, { visible: true });
      await page.click(searchSelector);

      // Type the contact name
      await page.type(searchSelector, contactName, { delay: 100 });

      // Wait for search results and click on the first match
      const contactSelector = `span[title="${contactName}"]`;
      await page.waitForSelector(contactSelector, { 
        visible: true, 
        timeout: 10000 
      });
      await page.click(contactSelector);

      logger.debug(`Contact found and selected: ${contactName}`);
    } catch (error) {
      logger.error(`Failed to search for contact: ${contactName}`, error as Error);
      throw new AppError(
        `Contact search failed for ${contactName}`,
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Send message to the selected contact
   * This improves the original message sending
   */
  private async sendMessage(
    page: Page, 
    passengerName: string, 
    fromStation: string, 
    toStation: string
  ): Promise<void> {
    try {
      // Wait for the message input box
      const messageInputSelector = 'div[data-testid="conversation-compose-box-input"]';
      await page.waitForSelector(messageInputSelector, { visible: true });

      // Compose the message
      const message = this.createMessage(passengerName, fromStation, toStation);

      // Type the message
      await page.type(messageInputSelector, message, { delay: 50 });

      // Send the message
      const sendButtonSelector = 'span[data-testid="send"]';
      await page.waitForSelector(sendButtonSelector, { visible: true });
      await page.click(sendButtonSelector);

      // Wait a moment for the message to be sent
      await page.waitForTimeout(2000);

      logger.debug(`Message sent to ${passengerName}`);
    } catch (error) {
      logger.error(`Failed to send message to ${passengerName}`, error as Error);
      throw new AppError(
        `Message sending failed for ${passengerName}`,
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Create the notification message
   * This centralizes message creation
   */
  private createMessage(passengerName: string, fromStation: string, toStation: string): string {
    return `🎉 Congratulations ${passengerName}! 

Your train ticket from ${fromStation} to ${toStation} has been successfully booked.

📋 Please check your registered email for the e-ticket details.

🚂 Have a safe and comfortable journey!

Best regards,
IRCTC Ticket Booking System`;
  }

  /**
   * Send notifications to multiple passengers
   */
  public async sendMultipleNotifications(
    page: Page,
    passengers: Array<{ name: string }>,
    fromStation: string,
    toStation: string
  ): Promise<void> {
    logger.info(`Sending WhatsApp notifications to ${passengers.length} passengers`);

    for (const passenger of passengers) {
      try {
        await this.sendNotification(page, passenger.name, fromStation, toStation);
        
        // Wait between notifications to avoid rate limiting
        await page.waitForTimeout(3000);
      } catch (error) {
        logger.error(`Failed to send notification to ${passenger.name}`, error as Error);
        // Continue with other passengers even if one fails
      }
    }

    logger.success('WhatsApp notifications completed');
  }
} 