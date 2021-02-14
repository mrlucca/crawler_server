const Crawler = require("../../lib/crawler");

class G1News extends Crawler {
    constructor(params) {
        super(params);
        this.MAIN_URL = "https://g1.globo.com/";
    }

    async run() {
        await this.goToMainG1Page()
    }

    async goToMainG1Page() {
        this.print("Go to g1 main page -> ", this.MAIN_URL);
        await this.page.goto(this.MAIN_URL);
    }
}

module.exports = G1News;