import { config } from '../config';

describe('Config', () => {
  it('should load configuration successfully', () => {
    const appConfig = config.getConfig();
    
    expect(appConfig).toBeDefined();
    expect(appConfig.irctc.userId).toBe('test_user');
    expect(appConfig.irctc.password).toBe('test_password');
    expect(appConfig.journey.from).toBe('NEW DELHI - NDLS');
    expect(appConfig.journey.to).toBe('HOWRAH JN - HWH');
    expect(appConfig.journey.date).toBe('22/04/2024');
    expect(appConfig.browser.headless).toBe(true);
    expect(appConfig.whatsapp.enabled).toBe(false);
  });

  it('should have correct passenger data', () => {
    const appConfig = config.getConfig();
    
    expect(appConfig.journey.passengers).toHaveLength(4);
    expect(appConfig.journey.passengers[0].name).toBe('Phoolan Devi');
    expect(appConfig.journey.passengers[0].age).toBe('45');
    expect(appConfig.journey.passengers[0].gender).toBe('F');
  });

  it('should have correct contact details', () => {
    const appConfig = config.getConfig();
    
    expect(appConfig.journey.contactDetails.contact).toBe('9876543210');
    expect(appConfig.journey.contactDetails.address).toBe('Test Address');
    expect(appConfig.journey.contactDetails.pin).toBe('123456');
  });

  it('should have correct payment details', () => {
    const appConfig = config.getConfig();
    
    expect(appConfig.journey.paymentDetails.cardNo).toBe('1234567890123456');
    expect(appConfig.journey.paymentDetails.expiry).toBe('1225');
    expect(appConfig.journey.paymentDetails.cvv).toBe('123');
    expect(appConfig.journey.paymentDetails.name).toBe('Test User');
  });
}); 