"use strict";
const Browser = require("../../lib/browser");
let params = {
  headless: false,
  chrome: false,
};

const browserGet = async (req, res) => {
  const id = req.params.id;
  if (globalBrowserInfo.browsers.hasOwnProperty(id)) {
    res.send({ browser_create: false, browser_id_exists: true });
  } else {
    globalBrowserInfo.browsers[id] = {
      browserObject: await new Browser(params).getBrowser(),
      browser_instance: params.chrome ? "chrome" : "chromium",
      headless: params.headless,
    };
    res.send({
      browser_id: id,
      browser_create: true,
    });
  }
};

module.exports = { browserGet };
