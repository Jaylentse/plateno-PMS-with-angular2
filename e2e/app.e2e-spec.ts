import { WeHotelPMSPage } from './app.po';

describe('we-hotel-pms App', () => {
  let page: WeHotelPMSPage;

  beforeEach(() => {
    page = new WeHotelPMSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
