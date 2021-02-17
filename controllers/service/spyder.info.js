"use strict";
const spyderInfo = async (req, res) => {
  let info = {};
  for (let key of Object.keys(globalSpyderInfo.spyders)) {
    let [spyder_name, browser_id] = key.split("__");
    if (!info.hasOwnProperty(spyder_name)) info[spyder_name] = {};
    info[spyder_name][browser_id] = { running: true };
  }
  res.send(info);
};

module.exports = { spyderInfo };
