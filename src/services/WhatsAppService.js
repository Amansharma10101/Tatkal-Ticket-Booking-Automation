const { logger } = require('../utils/logger');

class WhatsAppService {
  constructor(config) {
    this.config = config;
  }

  async sendNotification(page, passengerName, fromStation, toStation) {
    if (!this.config.enabled) {
      logger.info('WhatsApp notifications are disabled');
      return;
    }
    try {
      logger.info(`Sending WhatsApp notification to: ${passengerName}`);
      await page.goto('https://web.whatsapp.com/', {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });
      await this.waitForWhatsAppLoad(page);
      await this.searchContact(page, passengerName);
      await this.sendMessage(page, passengerName, fromStation, toStation);
      logger.success(`WhatsApp notification sent to: ${passengerName}`);
    } catch (error) {
      logger.error(`Failed to send WhatsApp notification to ${passengerName}`, error);
      throw new Error(`WhatsApp notification failed for ${passengerName}`);
    }
  }

  async waitForWhatsAppLoad(page) {
    try {
      await page.waitForSelector('div[data-testid="chat-list"]', {
        timeout: this.config.timeout
      });
      logger.debug('WhatsApp Web loaded successfully');
    } catch (error) {
      logger.error('Failed to load WhatsApp Web', error);
      throw new Error('WhatsApp Web failed to load');
    }
  }

  async searchContact(page, contactName) {
    try {
      const searchSelector = 'div[data-testid="chat-list-search"]';
      await page.waitForSelector(searchSelector, { visible: true });
      await page.click(searchSelector);
      await page.type(searchSelector, contactName, { delay: 100 });
      const contactSelector = `span[title="${contactName}"]`;
      await page.waitForSelector(contactSelector, {
        visible: true,
        timeout: 10000
      });
      await page.click(contactSelector);
      logger.debug(`Contact found and selected: ${contactName}`);
    } catch (error) {
      logger.error(`Failed to search for contact: ${contactName}`, error);
      throw new Error(`Contact search failed for ${contactName}`);
    }
  }

  async sendMessage(page, passengerName, fromStation, toStation) {
    try {
      const messageInputSelector = 'div[data-testid="conversation-compose-box-input"]';
      await page.waitForSelector(messageInputSelector, { visible: true });
      const message = this.createMessage(passengerName, fromStation, toStation);
      await page.type(messageInputSelector, message, { delay: 50 });
      const sendButtonSelector = 'span[data-testid="send"]';
      await page.waitForSelector(sendButtonSelector, { visible: true });
      await page.click(sendButtonSelector);
      await page.waitForTimeout(2000);
      logger.debug(`Message sent to ${passengerName}`);
    } catch (error) {
      logger.error(`Failed to send message to ${passengerName}`, error);
      throw new Error(`Message sending failed for ${passengerName}`);
    }
  }

  createMessage(passengerName, fromStation, toStation) {
    return `🎉 Congratulations ${passengerName}! \n\nYour train ticket from ${fromStation} to ${toStation} has been successfully booked.\n\n📋 Please check your registered email for the e-ticket details.\n\n🚂 Have a safe and comfortable journey!\n\nBest regards,\nIRCTC Ticket Booking System`;
  }

  async sendMultipleNotifications(page, passengers, fromStation, toStation) {
    logger.info(`Sending WhatsApp notifications to ${passengers.length} passengers`);
    for (const passenger of passengers) {
      try {
        await this.sendNotification(page, passenger.name, fromStation, toStation);
        await page.waitForTimeout(3000);
      } catch (error) {
        logger.error(`Failed to send notification to ${passenger.name}`, error);
      }
    }
    logger.success('WhatsApp notifications completed');
  }
}

module.exports = { WhatsAppService }; 