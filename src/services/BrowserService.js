const puppeteer = require('puppeteer');
const { logger } = require('../utils/logger');

class BrowserService {
  constructor(config) {
    this.browser = null;
    this.page = null;
    this.config = config;
  }

  async initialize() {
    try {
      logger.info('Initializing browser...');
      const launchOptions = {
        headless: this.config.headless,
        defaultViewport: null,
        args: [
          '--start-maximized',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
      };
      this.browser = await puppeteer.launch(launchOptions);
      this.page = await this.browser.newPage();
      await this.page.setDefaultTimeout(this.config.timeout);
      await this.page.setViewport(this.config.viewport);
      logger.success('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser', error);
      throw new Error('Browser initialization failed');
    }
  }

  async navigateTo(url, waitUntil = 'load') {
    if (!this.page) throw new Error('Browser not initialized');
    try {
      logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil, timeout: this.config.timeout });
      logger.success(`Successfully navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate to: ${url}`, error);
      throw new Error(`Navigation failed: ${url}`);
    }
  }

  async waitAndClick(selector, timeout) {
    if (!this.page) throw new Error('Browser not initialized');
    try {
      logger.debug(`Waiting for element: ${selector}`);
      await this.page.waitForSelector(selector, { visible: true, timeout: timeout || this.config.timeout });
      await this.page.click(selector);
      logger.debug(`Successfully clicked: ${selector}`);
    } catch (error) {
      logger.error(`Failed to click element: ${selector}`, error);
      throw new Error(`Element click failed: ${selector}`);
    }
  }

  async typeText(selector, text, delay = 200) {
    if (!this.page) throw new Error('Browser not initialized');
    try {
      logger.debug(`Typing text into: ${selector}`);
      await this.page.waitForSelector(selector, { visible: true });
      await this.page.click(selector);
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('a');
      await this.page.keyboard.up('Control');
      await this.page.type(selector, text, { delay });
      logger.debug(`Successfully typed text into: ${selector}`);
    } catch (error) {
      logger.error(`Failed to type text into: ${selector}`, error);
      throw new Error(`Text input failed: ${selector}`);
    }
  }

  async wait(ms) {
    logger.debug(`Waiting for ${ms}ms`);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  getPage() {
    if (!this.page) throw new Error('Browser not initialized');
    return this.page;
  }

  getBrowser() {
    if (!this.browser) throw new Error('Browser not initialized');
    return this.browser;
  }

  async newPage() {
    if (!this.browser) throw new Error('Browser not initialized');
    const newPage = await this.browser.newPage();
    await newPage.setDefaultTimeout(this.config.timeout);
    return newPage;
  }

  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        logger.success('Browser closed successfully');
      }
    } catch (error) {
      logger.error('Error closing browser', error);
    }
  }

  async takeScreenshot(filename) {
    if (!this.page) throw new Error('Browser not initialized');
    try {
      await this.page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
      logger.info(`Screenshot saved: ${filename}.png`);
    } catch (error) {
      logger.error('Failed to take screenshot', error);
    }
  }
}

module.exports = { BrowserService }; 