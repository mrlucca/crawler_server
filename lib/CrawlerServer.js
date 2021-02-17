"use strict";
const Browser = require("../lib/browser");
const { CRAWLER_LIST } = require("../crawlers/router");

class CrawlerServer {
  constructor() {
    this.browser = null;
    this.spyderStatus = {};
  }

  async setBrowser(browser) {
    this.browser = await browser;
  }

  async sypderRun(params) {
    if (CRAWLER_LIST.hasOwnProperty(params.spyder_name)) {
      console.log("Run spyder: ", params.spyder_name);
      if (!this.spyderStatus.hasOwnProperty(params.spyder_name)) {
        this.spyderStatus[params.spyder_name] = { running: false };
      } else {
        if (this.spyderStatus[params.spyder_name].running) {
          console.log("spyder is already running");
          return;
        }
      }
      params.browser = this.browser;
      params.server_context = this;
      try {
        let spyder = new CRAWLER_LIST[params.spyder_name](params);
        spyder.init();
        this.spyderStatus[params.spyder_name].running = true;
        this.spyderStatus[params.spyder_name].spyder_object = spyder;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(`Spyder ${params.spyder_name} not exists`);
    }
  }
}
module.exports = { CrawlerServer };
