const spyderInfo = async (req, res) => {
  res.send({ hello: true });
  console.log(globalSpyderInfo);
};

module.exports = { spyderInfo };
