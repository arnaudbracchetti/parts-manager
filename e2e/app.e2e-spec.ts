import { MyStockPage } from './app.po';

describe('my-stock App', () => {
  let page: MyStockPage;

  beforeEach(() => {
    page = new MyStockPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
