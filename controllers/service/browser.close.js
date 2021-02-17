"use strict";
const browserClose = async (req, res) => {
  const id = req.params.id;
  if (!globalBrowserInfo.browsers.hasOwnProperty(id)) {
    res.send({ browser_exists: false, browser_closed: true });
  } else {
    console.log(`Close browser id: ${id}`);
    globalBrowserInfo.browsers[id].browserObject.close();
    delete globalBrowserInfo.browsers[id];
    res.send({ browser_exists: true, browser_closed: true });
  }
};

module.exports = { browserClose };
