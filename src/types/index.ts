// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Passenger information interface
 * Defines the structure for passenger details
 */
export interface Passenger {
  name: string;
  age: string;
  gender: 'M' | 'F';
}

/**
 * Payment details interface
 * Contains all payment-related information
 */
export interface PaymentDetails {
  cardNo: string;
  expiry: string;
  cvv: string;
  name: string;
}

/**
 * Contact and address details
 */
export interface ContactDetails {
  contact: string;
  address: string;
  pin: string;
}

/**
 * Journey configuration
 * Contains all journey-related settings
 */
export interface JourneyConfig {
  from: string;
  to: string;
  date: string;
  passengers: Passenger[];
  contactDetails: ContactDetails;
  paymentDetails: PaymentDetails;
}

/**
 * Browser configuration options
 */
export interface BrowserConfig {
  headless: boolean;
  timeout: number;
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * WhatsApp notification settings
 */
export interface WhatsAppConfig {
  enabled: boolean;
  timeout: number;
}

/**
 * Application configuration
 * Main configuration object that combines all settings
 */
export interface AppConfig {
  irctc: {
    userId: string;
    password: string;
  };
  journey: JourneyConfig;
  browser: BrowserConfig;
  whatsapp: WhatsAppConfig;
}

/**
 * PDF ticket data structure
 */
export interface TicketData {
  passengerName: string;
  age: string;
  gender: string;
  fromStation: string;
  toStation: string;
  transactionId: string;
  pnrNumber: string;
}

/**
 * Error types for better error handling
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
} 