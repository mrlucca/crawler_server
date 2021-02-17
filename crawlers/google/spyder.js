const Crawler = require("../../lib/crawler");

class Google extends Crawler {
  constructor(params) {
    super(params);
    this.MAIN_URL = "https://www.google.com/";
  }

  async run() {
    await this.goToSearch();
  }

  async goToSearch() {
    this.print("Go to search-> ", this.MAIN_URL);
    await this.page.goto(this.MAIN_URL);
    await this.helper.sleep(5000);
    await this.page.$eval("input[name='q']", (e) => (e.value = "carlos"));
    await this.helper.sleep(5000);
    await this.page.$eval("input[name='btnK']", (e) => e.click());
    await this.checkPoint("google test", "google");
  }
}

module.exports = Google;
