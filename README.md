# 🚂 IRCTC Ticket Booking Automation

A modern, TypeScript-based automation tool for booking IRCTC train tickets with PDF generation and WhatsApp notifications.

## ✨ Features

- **Modern Tech Stack**: Built with TypeScript, latest Puppeteer, and modern Node.js practices
- **Automated Booking**: Complete automation of IRCTC ticket booking process
- **PDF Generation**: Automatic generation of e-tickets in PDF format
- **WhatsApp Notifications**: Send booking confirmations via WhatsApp
- **Comprehensive Logging**: Structured logging with Winston
- **Error Handling**: Robust error handling with custom error types
- **Configuration Management**: Environment-based configuration
- **Type Safety**: Full TypeScript support with strict typing

## 🏗️ Architecture

```
src/
├── config/          # Configuration management
├── services/        # Core business logic services
├── types/           # TypeScript interfaces and types
├── utils/           # Utility functions (logging, etc.)
└── index.ts         # Main entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- IRCTC account credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd irctc-ticket-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # IRCTC Credentials
   IRCTC_USER_ID=your_user_id
   IRCTC_PASSWORD=your_password
   
   # Journey Details
   FROM_STATION=NEW DELHI - NDLS
   TO_STATION=HOWRAH JN - HWH
   JOURNEY_DATE=22/04/2024
   
   # Contact Details
   CONTACT_NUMBER=9876543210
   ADDRESS=House no 313 sector 45
   PIN_CODE=124001
   
   # Payment Details (for testing only)
   CARD_NUMBER=5241670123456244
   CARD_EXPIRY=0625
   CARD_CVV=111
   CARD_HOLDER_NAME=Test User
   
   # Settings
   HEADLESS=false
   WHATSAPP_ENABLED=true
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the automation**
   ```bash
   npm start
   ```

## 📋 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Run in development mode with ts-node
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `IRCTC_USER_ID` | Your IRCTC user ID | ✅ |
| `IRCTC_PASSWORD` | Your IRCTC password | ✅ |
| `FROM_STATION` | Source station name | ✅ |
| `TO_STATION` | Destination station name | ✅ |
| `JOURNEY_DATE` | Journey date (DD/MM/YYYY) | ✅ |
| `CONTACT_NUMBER` | Contact phone number | ✅ |
| `ADDRESS` | Contact address | ✅ |
| `PIN_CODE` | PIN code | ✅ |
| `CARD_NUMBER` | Payment card number | ✅ |
| `CARD_EXPIRY` | Card expiry (MMYY) | ✅ |
| `CARD_CVV` | Card CVV | ✅ |
| `CARD_HOLDER_NAME` | Card holder name | ✅ |
| `HEADLESS` | Browser headless mode | ❌ |
| `WHATSAPP_ENABLED` | Enable WhatsApp notifications | ❌ |

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration management
│   ├── services/
│   │   ├── BrowserService.ts     # Browser automation
│   │   ├── PDFService.ts         # PDF generation
│   │   ├── WhatsAppService.ts    # WhatsApp notifications
│   │   └── IRCTCAutomationService.ts # Main automation logic
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── logger.ts             # Logging utility
│   └── index.ts                  # Main entry point
├── tickets/                      # Generated PDF tickets
├── logs/                         # Application logs
├── screenshots/                  # Debug screenshots
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 How It Works

### 1. **Browser Initialization**
- Launches Puppeteer browser with optimized settings
- Sets up viewport and timeout configurations

### 2. **IRCTC Navigation**
- Navigates to IRCTC train search page
- Handles initial page setup and cookies

### 3. **Train Search**
- Fills journey details (from, to, date)
- Selects available berth options
- Submits search request

### 4. **Train Selection**
- Selects the first available train
- Confirms booking selection

### 5. **Authentication**
- Logs in with IRCTC credentials
- Handles captcha input (manual)

### 6. **Passenger Details**
- Fills passenger information for all travelers
- Handles multiple passenger scenarios

### 7. **Contact Information**
- Fills contact and address details
- Sets up communication preferences

### 8. **Payment Processing**
- Navigates to payment gateway
- Fills payment card details
- Confirms transaction

### 9. **PDF Generation**
- Generates individual PDF tickets for each passenger
- Includes booking details and important information

### 10. **WhatsApp Notifications**
- Sends booking confirmations via WhatsApp Web
- Includes journey details and ticket information

## 🛠️ Development

### Code Quality

The project follows modern development practices:

- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Jest**: Unit testing framework
- **Winston**: Structured logging

### Error Handling

Custom error types for different scenarios:

- `NETWORK_ERROR`: Connection and navigation issues
- `AUTHENTICATION_ERROR`: Login and credential issues
- `VALIDATION_ERROR`: Configuration and input validation
- `TIMEOUT_ERROR`: Element waiting and timeout issues
- `UNKNOWN_ERROR`: Unexpected errors

### Logging

Comprehensive logging with different levels:

- **Info**: General process information
- **Success**: Successful operations
- **Warning**: Non-critical issues
- **Error**: Error conditions
- **Debug**: Detailed debugging information

## ⚠️ Important Notes

### Security
- **Never commit real credentials** to version control
- Use environment variables for sensitive data
- Payment details in the example are invalid (for testing)

### Legal Considerations
- This tool is for educational purposes
- Respect IRCTC's terms of service
- Use responsibly and ethically

### Limitations
- Manual captcha input required
- Website structure changes may break selectors
- Rate limiting may apply

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Browser not launching**
   - Check if Chrome/Chromium is installed
   - Verify system permissions

2. **Element not found**
   - IRCTC website structure may have changed
   - Update selectors in the service files

3. **Login failures**
   - Verify IRCTC credentials
   - Check if account is active

4. **WhatsApp notifications not working**
   - Ensure WhatsApp Web is accessible
   - Check contact names match exactly

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In logger.ts
level: 'debug'
```

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the logs in the `logs/` directory
- Review the troubleshooting section

---

**Disclaimer**: This tool is for educational purposes. Use responsibly and in accordance with IRCTC's terms of service. 