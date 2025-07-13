# 🚂 IRCTC Ticket Booking Automation

A **Node.js automation tool** that automates the complete IRCTC train ticket booking process.

## ✨ What It Does

- **Automates IRCTC ticket booking** from start to finish
- **Generates PDF tickets** for all passengers automatically
- **Sends WhatsApp notifications** with booking confirmations
- **Handles multiple passengers** in a single booking
- **Built with modern technologies** (JavaScript, Puppeteer, PDFKit)

## 🛠️ Technologies Used

- **JavaScript (Node.js)**
- **Puppeteer** - Browser automation
- **PDFKit** - PDF generation
- **Winston** - Logging
- **Dotenv** - Configuration management

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Configuration
```bash
cp env.example .env
```

Edit `.env` with your details:
```env
IRCTC_USER_ID=your_user_id
IRCTC_PASSWORD=your_password
FROM_STATION=NEW DELHI - NDLS
TO_STATION=HOWRAH JN - HWH
JOURNEY_DATE=22/04/2024
CONTACT_NUMBER=9876543210
ADDRESS=Your Address
PIN_CODE=123456
CARD_NUMBER=1234567890123456
CARD_EXPIRY=1225
CARD_CVV=123
CARD_HOLDER_NAME=Your Name
```

### 3. Run the Automation
```bash
npm start
```

## 📁 Project Structure

```
src/
├── config/          # Configuration management
├── services/        # Core automation services
├── utils/           # Utilities (logging)
└── index.js         # Main entry point
```

## 🔄 How It Works

1. **Browser Initialization** - Launches Chrome with Puppeteer
2. **Website Navigation** - Goes to IRCTC train search page
3. **Train Search** - Fills journey details and searches
4. **Train Selection** - Selects the first available train
5. **Login** - Authenticates with IRCTC credentials
6. **Passenger Details** - Fills information for all travelers
7. **Contact Information** - Adds contact and address details
8. **Payment** - Proceeds to payment gateway
9. **PDF Generation** - Creates e-tickets for each passenger
10. **WhatsApp Notifications** - Sends booking confirmations

## 📊 Available Scripts

- `npm start` - Run the application
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## ⚠️ Important Notes

- **Educational Purpose**: This is for learning and portfolio
- **Manual Captcha**: Requires manual captcha input during login
- **Test Credentials**: Use invalid payment details for testing
- **Respectful Use**: Follow IRCTC's terms of service

## 📄 License

MIT License

---

**Built with ❤️ for learning and portfolio purposes** 