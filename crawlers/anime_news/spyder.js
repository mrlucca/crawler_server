const Crawler = require("../../lib/crawler");

class AnimeNews extends Crawler {
    constructor(params){
        super(params)
        this.URL_BASE = "https://www.animenewsnetwork.com/encyclopedia/anime/episodes/latest";
    }

    async run() {
        this.print("GO TO MAIN PAGE NEWS ANIME", this.URL_BASE)
        await this.goToMainPageNewsAnime()
    }

    async goToMainPageNewsAnime() {
        await this.page.goto(this.URL_BASE)
    }
}

module.exports = AnimeNews;