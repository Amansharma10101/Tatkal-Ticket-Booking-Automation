const dotenv = require('dotenv');
dotenv.config();

class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  getConfig() {
    return this.config;
  }

  loadConfig() {
    this.validateRequiredEnvVars();
    return {
      irctc: {
        userId: process.env.IRCTC_USER_ID,
        password: process.env.IRCTC_PASSWORD,
      },
      journey: {
        from: process.env.FROM_STATION,
        to: process.env.TO_STATION,
        date: process.env.JOURNEY_DATE,
        passengers: this.loadPassengers(),
        contactDetails: {
          contact: process.env.CONTACT_NUMBER,
          address: process.env.ADDRESS,
          pin: process.env.PIN_CODE,
        },
        paymentDetails: {
          cardNo: process.env.CARD_NUMBER,
          expiry: process.env.CARD_EXPIRY,
          cvv: process.env.CARD_CVV,
          name: process.env.CARD_HOLDER_NAME,
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

  validateRequiredEnvVars() {
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

  loadPassengers() {
    return [
      { name: 'Phoolan Devi', age: '45', gender: 'F' },
      { name: 'Ghansidas Pandey', age: '50', gender: 'M' },
      { name: 'Maindak Prasad', age: '24', gender: 'M' },
      { name: 'Anguri Devi', age: '20', gender: 'F' },
    ];
  }
}

const config = new Config();
module.exports = { config }; 