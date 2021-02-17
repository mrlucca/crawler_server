"use strict";
const express = require("express");
const { spyder, browser, base } = require("../controllers/router");
const app = express();
const PORT = 3000;

global.globalBrowserInfo = { browsers: {} };
global.globalSpyderInfo = { spyders: {} };

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}
(async () => {
  app.get("/", base.home);
  app.get("/browser/get/:id", browser.get);
  app.get("/browser/close/:id", browser.close);
  app.get("/browser/info/", browser.info);
  app.get("/spyder/start/:browser_id/:spyder", spyder.start);
  app.get("/spyder/close/:browser_id/:spyder", spyder.close);
  app.get("/spyder/info/", spyder.info);
  app.listen(PORT, () => console.log("Gator app listening on port 3000!"));
})();
