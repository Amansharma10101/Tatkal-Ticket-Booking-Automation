// ============================================================================
// BROWSER AUTOMATION SERVICE
// ============================================================================

import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';
import { BrowserConfig, AppError, ErrorType } from '../types';
import { logger } from '../utils/logger';

/**
 * BrowserService class handles all browser automation operations
 * This modernizes the original browser handling with better error handling and logging
 */
export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig) {
    this.config = config;
  }

  /**
   * Initialize browser with proper configuration
   * This replaces the basic puppeteer.launch() from the original code
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('Initializing browser...');
      
      const launchOptions: LaunchOptions = {
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
      
      // Set default timeout
      await this.page.setDefaultTimeout(this.config.timeout);
      
      // Set viewport
      await this.page.setViewport(this.config.viewport);
      
      logger.success('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser', error as Error);
      throw new AppError(
        'Browser initialization failed',
        ErrorType.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Navigate to a URL with proper error handling
   * This improves upon the original goto() calls
   */
  public async navigateTo(url: string, waitUntil: 'load' | 'networkidle0' | 'networkidle2' = 'load'): Promise<void> {
    if (!this.page) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }

    try {
      logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil, timeout: this.config.timeout });
      logger.success(`Successfully navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate to: ${url}`, error as Error);
      throw new AppError(
        `Navigation failed: ${url}`,
        ErrorType.NETWORK_ERROR,
        error as Error
      );
    }
  }

  /**
   * Wait for and click an element with retry logic
   * This improves the original waitAndClick function
   */
  public async waitAndClick(selector: string, timeout?: number): Promise<void> {
    if (!this.page) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }

    try {
      logger.debug(`Waiting for element: ${selector}`);
      
      // Wait for element to be visible
      await this.page.waitForSelector(selector, { 
        visible: true, 
        timeout: timeout || this.config.timeout 
      });
      
      // Click the element
      await this.page.click(selector);
      
      logger.debug(`Successfully clicked: ${selector}`);
    } catch (error) {
      logger.error(`Failed to click element: ${selector}`, error as Error);
      throw new AppError(
        `Element click failed: ${selector}`,
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Type text into an element with proper delays
   * This improves the original type() calls
   */
  public async typeText(selector: string, text: string, delay: number = 200): Promise<void> {
    if (!this.page) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }

    try {
      logger.debug(`Typing text into: ${selector}`);
      
      // Wait for element to be visible
      await this.page.waitForSelector(selector, { visible: true });
      
      // Clear existing text and type new text
      await this.page.click(selector);
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('a');
      await this.page.keyboard.up('Control');
      await this.page.type(selector, text, { delay });
      
      logger.debug(`Successfully typed text into: ${selector}`);
    } catch (error) {
      logger.error(`Failed to type text into: ${selector}`, error as Error);
      throw new AppError(
        `Text input failed: ${selector}`,
        ErrorType.TIMEOUT_ERROR,
        error as Error
      );
    }
  }

  /**
   * Wait for a specific amount of time
   * This replaces setTimeout with proper async handling
   */
  public async wait(ms: number): Promise<void> {
    logger.debug(`Waiting for ${ms}ms`);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get the current page instance
   */
  public getPage(): Page {
    if (!this.page) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }
    return this.page;
  }

  /**
   * Get the browser instance
   */
  public getBrowser(): Browser {
    if (!this.browser) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }
    return this.browser;
  }

  /**
   * Create a new page/tab
   */
  public async newPage(): Promise<Page> {
    if (!this.browser) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }
    
    const newPage = await this.browser.newPage();
    await newPage.setDefaultTimeout(this.config.timeout);
    return newPage;
  }

  /**
   * Close browser and cleanup resources
   */
  public async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        logger.success('Browser closed successfully');
      }
    } catch (error) {
      logger.error('Error closing browser', error as Error);
    }
  }

  /**
   * Take a screenshot for debugging
   */
  public async takeScreenshot(filename: string): Promise<void> {
    if (!this.page) {
      throw new AppError('Browser not initialized', ErrorType.VALIDATION_ERROR);
    }

    try {
      await this.page.screenshot({ 
        path: `screenshots/${filename}.png`,
        fullPage: true 
      });
      logger.info(`Screenshot saved: ${filename}.png`);
    } catch (error) {
      logger.error('Failed to take screenshot', error as Error);
    }
  }
} 