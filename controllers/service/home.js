const { CRAWLER_LIST } = require("../../crawlers/router");
const home = async (req, res) => {
  res.send(`
    <body>
        <center>
            <h1> Crawler API </h1>
            <h3> Spyders </h3>
            <p> ${Object.keys(CRAWLER_LIST).join(" - ")}</p>
        </center>
    </body>`);
};

module.exports = { home };
