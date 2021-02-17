"use strict";
const { Helper } = require("./helper");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

class Crawler {
  constructor(params) {
    this.params = params;
    this.browser = params.browser;
    this.page = null;
    this.MAX_NAVIGATION_TIMEOUT = 40000;
    this.MAX_TIMEOUT_PUPPETEER_FUNCTIONS = 40000;
    this.logs = [];
    this.helper = null;
    this.flowScreenshotFolderPath = `${__dirname}${path.sep}..${path.sep}screenshots`;
  }

  async init() {
    console.log(__dirname);
    this.page = await this.getPage();
    this.helper = new Helper(this.page);
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

  async checkPoint(title, fileName, newPage = null) {
    console.log(
      ` | > [CHECK:POINT] New Check Point saved! \n |> [ACTION]: ${title}`
    );
    let page = newPage ? newPage : this.page;
    let screenshotTime = moment().format("HH_mm_ss");
    if (!fs.existsSync(this.flowScreenshotFolderPath)) {
      fs.mkdirSync(this.flowScreenshotFolderPath);
    }
    await page.screenshot({
      path: `${this.flowScreenshotFolderPath}${path.sep}__${fileName}__${screenshotTime}.png`,
    });
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
