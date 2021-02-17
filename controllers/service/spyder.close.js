"use strict";
const spyderClose = async (req, res) => {
  let spyder_name = req.params.spyder;
  let browser_id = req.params.browser_id;
  let hash = `${spyder_name}__${browser_id}`;
  if (!globalSpyderInfo.spyders.hasOwnProperty(hash)) {
    res.send({ error: true, msg: "spyder not exists!" });
  } else {
    console.log(`Close ${spyder_name} in browser ${browser_id}`);
    globalSpyderInfo.spyders[hash].spyderStatus[
      spyder_name
    ].spyder_object.page.close();
    res.send({ error: false, msg: "spyder closed!" });
  }
};

module.exports = { spyderClose };
