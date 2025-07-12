// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration class that manages all application settings
 * This centralizes all configuration and provides type safety
 */
export class Config {
  private static instance: Config;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Singleton pattern - ensures only one config instance
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Get the complete application configuration
   */
  public getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Load and validate configuration from environment variables
   * This replaces the hardcoded values in the original code
   */
  private loadConfig(): AppConfig {
    // Validate required environment variables
    this.validateRequiredEnvVars();

    return {
      irctc: {
        userId: process.env.IRCTC_USER_ID!,
        password: process.env.IRCTC_PASSWORD!,
      },
      journey: {
        from: process.env.FROM_STATION!,
        to: process.env.TO_STATION!,
        date: process.env.JOURNEY_DATE!,
        passengers: this.loadPassengers(),
        contactDetails: {
          contact: process.env.CONTACT_NUMBER!,
          address: process.env.ADDRESS!,
          pin: process.env.PIN_CODE!,
        },
        paymentDetails: {
          cardNo: process.env.CARD_NUMBER!,
          expiry: process.env.CARD_EXPIRY!,
          cvv: process.env.CARD_CVV!,
          name: process.env.CARD_HOLDER_NAME!,
        },
      },
      browser: {
        headless: process.env.HEADLESS === 'true',
        timeout: parseInt(process.env.BROWSER_TIMEOUT || '100000'),
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
      whatsapp: {
        enabled: process.env.WHATSAPP_ENABLED === 'true',
        timeout: parseInt(process.env.WHATSAPP_TIMEOUT || '30000'),
      },
    };
  }

  /**
   * Validate that all required environment variables are present
   * This prevents runtime errors due to missing configuration
   */
  private validateRequiredEnvVars(): void {
    const requiredVars = [
      'IRCTC_USER_ID',
      'IRCTC_PASSWORD',
      'FROM_STATION',
      'TO_STATION',
      'JOURNEY_DATE',
      'CONTACT_NUMBER',
      'ADDRESS',
      'PIN_CODE',
      'CARD_NUMBER',
      'CARD_EXPIRY',
      'CARD_CVV',
      'CARD_HOLDER_NAME',
    ];

    const missingVars = requiredVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  /**
   * Load passenger data from environment or use defaults
   * In a real application, this could come from a database or API
   */
  private loadPassengers() {
    // For demo purposes, using sample passengers
    // In production, this could be loaded from a database
    return [
      {
        name: 'Phoolan Devi',
        age: '45',
        gender: 'F' as const,
      },
      {
        name: 'Ghansidas Pandey',
        age: '50',
        gender: 'M' as const,
      },
      {
        name: 'Maindak Prasad',
        age: '24',
        gender: 'M' as const,
      },
      {
        name: 'Anguri Devi',
        age: '20',
        gender: 'F' as const,
      },
    ];
  }
}

// Export a singleton instance
export const config = Config.getInstance(); 