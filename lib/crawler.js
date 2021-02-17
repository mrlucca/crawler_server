"use strict";

class Crawler {
  constructor(params) {
    this.params = params;
    this.browser = params.browser;
    this.page = null;
    this.MAX_NAVIGATION_TIMEOUT = 40000;
    this.MAX_TIMEOUT_PUPPETEER_FUNCTIONS = 40000;
    this.logs = [];
  }

  async init() {
    this.page = await this.getPage();
    await this.run();
    if (!this.params.debug) {
      await this.page.close();
      delete this.params.server_context.spyderStatus[this.params.spyder_name];
    }
  }

  async run() {
    throw new Error("Run method not implemented");
  }

  print(msg) {
    this.logs.push(msg);
  }

  async getPage() {
    this.print(
      "GET PAGE IN BROWSER TO SPYDER: ",
      this.params.spyder_name.toUpperCase()
    );
    let page = await this.browser.newPage();
    const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
    const chromeUserAgent = headlessUserAgent.replace(
      "HeadlessChrome",
      "Chrome"
    );
    await page.setUserAgent(chromeUserAgent);
    page.setDefaultNavigationTimeout(this.MAX_NAVIGATION_TIMEOUT);
    page.setDefaultTimeout(this.MAX_TIMEOUT_PUPPETEER_FUNCTIONS);
    await page.setViewport({
      width: 1800,
      height: 1900,
    });

    return page;
  }
}

module.exports = Crawler;
