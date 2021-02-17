"use strict";
const browserInfo = async (req, res) => {
  let info = {};
  for (let [browser_id, value] of Object.entries(globalBrowserInfo.browsers)) {
    info[browser_id] = {
      length_pages: (await value.browserObject.pages()).length,
      browser_instance: value.browser_instance,
      headless: value.headless,
    };
  }
  res.send(info);
};

module.exports = { browserInfo };
