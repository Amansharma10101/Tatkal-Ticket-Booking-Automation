const { BrowserService } = require('./BrowserService');
const { PDFService } = require('./PDFService');
const { WhatsAppService } = require('./WhatsAppService');

class IRCTCAutomationService {
  constructor(config) {
    this.config = config;
    this.browserService = new BrowserService(config.browser);
    this.pdfService = new PDFService();
    this.whatsappService = new WhatsAppService(config.whatsapp);
  }

  async executeBooking() {
    try {
      console.log('\n🔄 Starting automation...');
      await this.browserService.initialize();
      console.log('✅ Browser initialized');
      await this.navigateToIRCTC();
      console.log('✅ Navigated to IRCTC website');
      await this.searchTrains();
      console.log('✅ Train search completed');
      await this.selectTrain();
      console.log('✅ Train selected');
      await this.loginToIRCTC();
      console.log('✅ Login completed');
      await this.fillPassengerDetails();
      console.log('✅ Passenger details filled');
      await this.fillContactDetails();
      console.log('✅ Contact details filled');
      await this.proceedToPayment();
      console.log('✅ Payment section reached');
      await this.fillPaymentDetails();
      console.log('✅ Payment details filled');
      await this.generateTickets();
      console.log('✅ PDF tickets generated');
      await this.sendNotifications();
      console.log('✅ Notifications sent');
    } catch (error) {
      console.error('❌ Automation failed:', error instanceof Error ? error.message : error);
      throw error;
    } finally {
      await this.browserService.close();
    }
  }

  async navigateToIRCTC() {
    await this.browserService.navigateTo(
      'https://www.irctc.co.in/nget/train-search',
      'networkidle0'
    );
    await this.browserService.waitAndClick('button.btn.btn-primary');
  }

  async searchTrains() {
    const { from, to, date } = this.config.journey;
    await this.browserService.typeText('input[aria-controls="pr_id_1_list"]', from);
    await this.browserService.typeText('input[aria-controls="pr_id_2_list"]', to);
    await this.browserService.waitAndClick('.ng-tns-c59-10.ui-calendar');
    await this.browserService.getPage().keyboard.down('Control');
    await this.browserService.getPage().keyboard.press('a');
    await this.browserService.getPage().keyboard.up('Control');
    await this.browserService.typeText('.ng-tns-c59-10.ui-calendar', date);
    await this.browserService.waitAndClick('.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c66-11.pi.pi-chevron-down');
    await this.browserService.waitAndClick('label[for="availableBerth"]');
    await this.browserService.waitAndClick('.search_btn.train_Search');
  }

  async selectTrain() {
    await this.browserService.waitAndClick(
      '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.ng-star-inserted > div:nth-child(5) > div > table > tr > td:nth-child(1) > div'
    );
    await this.browserService.waitAndClick(
      '#divMain > div > app-train-list > div.col-sm-9.col-xs-12 > div > div.ng-star-inserted > div:nth-child(3) > div.form-group.no-pad.col-xs-12.bull-back.border-all > app-train-avl-enq > div.col-xs-12 > div > span > span > button.btnDefault.train_Search.ng-star-inserted'
    );
    await this.browserService.waitAndClick(
      '.ng-tns-c57-14.ui-confirmdialog-acceptbutton.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-icon-left.ng-star-inserted'
    );
  }

  async loginToIRCTC() {
    const { userId, password } = this.config.irctc;
    await this.browserService.waitAndClick('#userId');
    await this.browserService.typeText('#userId', userId);
    await this.browserService.waitAndClick('#pwd');
    await this.browserService.typeText('#pwd', password);
    console.log('⏳ Please enter the captcha manually...');
    await this.browserService.wait(10000);
    await this.browserService.waitAndClick('.search_btn.train_Search');
  }

  async fillPassengerDetails() {
    const { passengers } = this.config.journey;
    for (let i = 1; i < passengers.length; i++) {
      await this.browserService.waitAndClick(
        '#ui-panel-12-content > div > div.form-group.col-xs-12.padding.ng-tns-c79-64 > div.pull-left.ng-star-inserted > a > span'
      );
    }
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      const passengerIndex = i + 1;
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-3.col-xs-12 > p-autocomplete > span > input`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-3.col-xs-12 > p-autocomplete > span > input`,
        passenger.name
      );
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-1.col-xs-6 > input`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-1.col-xs-6 > input`,
        passenger.age
      );
      await this.browserService.waitAndClick(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-2.col-xs-6 > select`
      );
      await this.browserService.typeText(
        `#ui-panel-12-content > div > div:nth-child(${passengerIndex}) > div.col-sm-11.col-xs-12.remove-padding.pull-left > div > app-passenger > div > div:nth-child(1) > span > div.Layer_7.col-sm-2.col-xs-6 > select`,
        passenger.gender
      );
      await this.browserService.getPage().keyboard.press('Enter');
    }
  }

  async fillContactDetails() {
    const { contactDetails } = this.config.journey;
    await this.browserService.waitAndClick('input[formcontrolname="mobileNumber"]');
    await this.browserService.typeText('input[formcontrolname="mobileNumber"]', contactDetails.contact);
    await this.browserService.typeText('#aaa1', contactDetails.address);
    await this.browserService.typeText('input[formcontrolname="pinCode"]', contactDetails.pin);
    await this.browserService.waitAndClick('#address-postOffice');
    await this.browserService.typeText('#address-postOffice', 'Bhali');
    await this.browserService.getPage().keyboard.press('Enter');
    await this.browserService.waitAndClick('label[for="autoUpgradation"]');
    await this.browserService.waitAndClick('#travelInsuranceOptedYes-0 > div > div.ui-radiobutton-box.ui-widget.ui-state-default > span');
    await this.browserService.waitAndClick('.ui-radiobutton-icon.ui-clickable.pi.pi-circle-on');
    await this.browserService.waitAndClick('.train_Search.btnDefault');
  }

  async proceedToPayment() {
    console.log('⏳ Please enter the captcha manually...');
    await this.browserService.wait(15000);
    await this.browserService.waitAndClick('.train_Search.btnDefault');
    await this.browserService.waitAndClick('div.col-pad.col-xs-12.bank-text');
    await this.browserService.waitAndClick('.btn.btn-primary.hidden-xs.ng-star-inserted');
  }

  async fillPaymentDetails() {
    const { paymentDetails } = this.config.journey;
    await this.browserService.waitAndClick('.userCardNumber');
    await this.browserService.typeText('.userCardNumber', paymentDetails.cardNo);
    await this.browserService.waitAndClick('#validity');
    await this.browserService.typeText('#validity', paymentDetails.expiry);
    await this.browserService.waitAndClick('#divCvv');
    await this.browserService.typeText('#divCvv', paymentDetails.cvv);
    await this.browserService.waitAndClick('input[name="cardName"]');
    await this.browserService.typeText('input[name="cardName"]', paymentDetails.name);
    await this.browserService.waitAndClick('#confirm-purchase');
  }

  async generateTickets() {
    const { passengers, from, to } = this.config.journey;
    const ticketsData = passengers.map(passenger => ({
      passengerName: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      fromStation: from,
      toStation: to,
      transactionId: '0095562596',
      pnrNumber: '6422380568',
    }));
    await this.pdfService.generateMultipleTickets(ticketsData);
  }

  async sendNotifications() {
    const { passengers, from, to } = this.config.journey;
    const whatsappPage = await this.browserService.newPage();
    await this.whatsappService.sendMultipleNotifications(
      whatsappPage,
      passengers,
      from,
      to
    );
  }
}

module.exports = { IRCTCAutomationService }; 