// Test setup file
import { config } from '../config';

// Mock environment variables for testing
process.env.IRCTC_USER_ID = 'test_user';
process.env.IRCTC_PASSWORD = 'test_password';
process.env.FROM_STATION = 'NEW DELHI - NDLS';
process.env.TO_STATION = 'HOWRAH JN - HWH';
process.env.JOURNEY_DATE = '22/04/2024';
process.env.CONTACT_NUMBER = '9876543210';
process.env.ADDRESS = 'Test Address';
process.env.PIN_CODE = '123456';
process.env.CARD_NUMBER = '1234567890123456';
process.env.CARD_EXPIRY = '1225';
process.env.CARD_CVV = '123';
process.env.CARD_HOLDER_NAME = 'Test User';
process.env.HEADLESS = 'true';
process.env.WHATSAPP_ENABLED = 'false';
process.env.BROWSER_TIMEOUT = '5000';
process.env.WHATSAPP_TIMEOUT = '5000'; 