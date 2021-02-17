const exec = require("child_process").exec;
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const ObjectsToCsv = require("objects-to-csv");

class Helper {
  constructor(driver) {
    this.driver = driver;
    this.sleep = this.sleep.bind(this);
    this.iterationLimit = 3;
  }

  async click(selector, index = 0) {
    return this.waitFor(selector, index, true);
  }

  async retryRequest(promiseFactory, retryCount) {
    try {
      return await promiseFactory();
    } catch (error) {
      console.log("Resquest failed...", error);
      if (retryCount <= 0) {
        throw error;
      }
      console.log("retrying...");
      return await this.retryRequest(promiseFactory, retryCount - 1);
    }
  }

  async closeCertificateApplication() {
    let path = process.env.CERTIFICATE_PATH;
    let script = "taskkill -IM " + process.env.CERTIFICATE_APP_NAME;
    let child = await exec(script);
    child.on("close", () => console.log("finished"));
    await this.sleep(1500);
  }

  //https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript/14781678
  async absoluteUrlFromRelative(current, relative) {
    var stack = current.split("/"),
      parts = relative.split("/");
    stack.pop();
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == ".") continue;
      if (parts[i] == "..") stack.pop();
      else stack.push(parts[i]);
    }
    return stack.join("/");
  }

  //https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries#22907134
  async downloadFromLink(url, destiny) {
    const protocolType = url.startsWith("https") ? "https" : "http";
    return new Promise((resolve, reject) => {
      var file = fs.createWriteStream(destiny);
      eval(protocolType)
        .get(url, (response) => {
          response.pipe(file);
          file.on("finish", function () {
            file.close(); // close() is async, call callback after close completes.
            resolve(true);
          });
        })
        .on("error", function (err) {
          // Handle errors
          fs.unlink(destiny); // Delete the file async. (But we don't check the result)
          reject(err);
        });
    });
  }

  static async dataFolderPath() {
    return path.resolve(__dirname, "../data/");
  }

  async getDataFolderPath() {
    return Helper.dataFolderPath();
  }

  async getFileNameFromUrl(url) {
    return url.split("/")[url.split("/").length - 1];
  }

  isRunning(win, mac, linux) {
    return new Promise(function (resolve, reject) {
      const plat = process.platform;
      const cmd =
        plat == "win32"
          ? "tasklist"
          : plat == "darwin"
          ? "ps -ax | grep " + mac
          : plat == "linux"
          ? "ps -A"
          : "";
      const proc =
        plat == "win32"
          ? win
          : plat == "darwin"
          ? mac
          : plat == "linux"
          ? linux
          : "";
      if (cmd === "" || proc === "") {
        resolve(false);
      }
      exec(cmd, function (err, stdout, stderr) {
        resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1);
      });
      const Helper = require("./helper");
    });
  }

  getElementByXpath(path) {
    return document.evaluate(
      path,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  }

  async select(id, text) {
    if (typeof text != typeof "") text = text.toString();

    await this.waitFor("#" + id);
    this.sleep(2000);
    let queryString = `//*[@id=\"${id}\"]/option[normalize-space()=\"${text}\"]`;
    let option = (await this.driver.$x(queryString))[0];
    if (!option) option = this.getElementByXpath(queryString);

    let optionValue = await option.getProperty("value");
    let value = await optionValue.jsonValue();
    await this.driver.select("#" + id, value);
  }

  async sleep(ms) {
    await new Promise((r) => setTimeout(r, ms));
  }

  async scrollDown() {
    this.driver.$eval("html", () => window.scrollBy(0, window.innerHeight));
  }

  async scrollUp() {
    this.driver.$eval("html", () => window.scrollBy(0, 0));
  }

  async saveObjectsInCsv(rows, fileName) {
    const csv = new ObjectsToCsv(rows);
    const dataFolder = await this.getDataFolderPath();
    const filePath = `${dataFolder}${path.sep}${fileName}.csv`;
    await csv.toDisk(filePath);
    console.log("File saved");
  }

  async waitFor(selector, index = 0, click = false) {
    return await this.driver.evaluate(
      async (selector, index, click) => {
        let el;
        await new Promise((r) => setTimeout(r, 1500));

        for (let i = 0; i < 5; i++) {
          el = document.querySelectorAll(selector)[index];
          if (el) {
            if (click) {
              el.click();
              console.log("clicked on " + selector);
            }
            return el;
          }

          await new Promise((r) => setTimeout(r, 2000));
        }
        console.log("Element: " + selector + " not found!");
        return null;
      },
      selector,
      index,
      click
    );
  }

  async waitForJsQuery(query, iteration = 0, debug = false) {
    if (debug) console.log("Looking for js query", query);
    let object = await this.driver.evaluateHandle(query);
    if (debug) console.log(object);
    if (object != null || iteration >= this.iterationLimit) {
      return object;
    } else {
      console.log("Query failed, waiting 3 secs...");
      this.sleep(3000);
      return this.waitForJsQuery(query, ++iteration);
    }
  }

  async clearField(selector) {
    await this.driver.evaluate((selector) => {
      document.querySelector(selector).value = "";
    }, selector);
  }

  async type(selector, text, delay = 0) {
    await this.driver.type(selector, text, { delay: delay });
  }

  // https://stackoverflow.com/questions/48608971/how-to-manage-log-in-session-through-headless-chrome
  async loadCookies(cookiesFile = "driver_cookies.txt") {
    let dataFolderPath = await this.getDataFolderPath();
    let cookiesPath = dataFolderPath + path.sep + cookiesFile;
    const sessionExists = fs.existsSync(cookiesPath);
    if (sessionExists) {
      const content = fs.readFileSync(cookiesPath);
      const cookiesArr = JSON.parse(content);
      if (cookiesArr.length !== 0) {
        for (let cookie of cookiesArr) {
          await this.driver.setCookie(cookie);
        }
        console.log("Session has been loaded in the browser");
      }
    } else {
      console.log("Session cookies file not found");
    }
  }

  async saveCookies(cookiesFile = "driver_cookies.txt") {
    const cookiesObject = await this.driver.cookies();
    let dataFolderPath = await this.getDataFolderPath();
    let cookiesPath = dataFolderPath + path.sep + cookiesFile;
    console.log("Saving session to " + cookiesPath);
    fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
    console.log("Session has been saved to " + cookiesPath);
  }

  // Método para criação de pastas dentro do data
  // Retorna o caminho completo da pasta criada
  // Aceita criação de pastas recursivamente EX: 'pasta1/pasta2/pasta3' cria 3 pastas no data
  async createNewDataFolder(name = null) {
    const folderName = name ? name : "temp_" + moment().format("DD_MM_YYYY");

    let dataPath = await this.getDataFolderPath();
    let folderPath = dataPath + path.sep + folderName;
    if (!fs.existsSync(folderPath)) {
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }

    return folderPath;
  }
}

module.exports = { Helper };
