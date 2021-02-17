"use strict";
const { CrawlerServer } = require("../../lib/CrawlerServer");
const { CRAWLER_LIST } = require("../../crawlers/router");
const spyderStart = async (req, res) => {
  let browser_id = req.params.browser_id;
  if (globalBrowserInfo.browsers.hasOwnProperty(browser_id)) {
    let spyder_name = req.params.spyder;
    let browser = globalBrowserInfo.browsers[browser_id].browserObject;
    if (CRAWLER_LIST.hasOwnProperty(spyder_name)) {
      console.log(`Start ${spyder_name} in browser ${browser_id}`);
      let server = new CrawlerServer();
      await server.setBrowser(browser);
      server.sypderRun({
        spyder_name: spyder_name,
        debug: true,
      });
      globalSpyderInfo.spyders[`${spyder_name}__${browser_id}`] = server;
      res.send({ error: false, msg: "crawler started" });
    } else {
      res.send({ error: true, msg: "crawler not exists" });
    }
  } else {
    res.send({ error: true, msg: "Broser id not exists" });
  }
};

module.exports = { spyderStart };
