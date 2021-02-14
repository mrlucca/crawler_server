const puppeteer = require("puppeteer");

class Browser{
    constructor(params) {
        this.params = params;
        this.browser = null;
    }

    async getBrowser() {
        console.log("opening browser...");
        let browserOptions = {
            headless: this.params.headless,
            args: [
                "--disable-infobars",
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        };

        if (this.params.chrome) {
            console.log("[INFO] Puppeteer with chrome activate");
            browserOptions.executablePath = "/usr/bin/google-chrome-stable";
        }

        return await puppeteer.launch(browserOptions);
    }
}

module.exports = Browser;