"use strict";

const AnimeNews = require("./anime_news/spyder");
const G1News = require("./g1_news/spyder");

const CRAWLER_LIST = {
  anime_news: AnimeNews,
  g1_news: G1News,
};

module.exports = { CRAWLER_LIST };
