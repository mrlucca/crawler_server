const { home } = require("./service/home");
const { spyderStart } = require("./service/spyder.start");
const { spyderClose } = require("./service/spyder.close");
const { spyderInfo } = require("./service/spyder.info");
const { browserClose } = require("./service/browser.close");
const { browserGet } = require("./service/browser.get");
const { browserInfo } = require("./service/browser.info");

module.exports = {
  base: {
    home: home,
  },
  spyder: {
    start: spyderStart,
    close: spyderClose,
    info: spyderInfo,
  },
  browser: {
    get: browserGet,
    close: browserClose,
    info: browserInfo,
  },
};
