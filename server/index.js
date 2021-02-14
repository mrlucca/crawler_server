"use strict"
const Browser = require("../lib/browser");
const { CRAWLER_LIST } = require("../crawlers/router")

class Server {
    constructor() {
        this.browser = null;
        this.spyderStatus = {};
    }

    async run(params) {
        this.browser = await new Browser(params.browser).getBrowser()
    }

    async sypderRun(params) {
        if (CRAWLER_LIST.hasOwnProperty(params.spyder_name)){
            console.log("Run spyder: ", params.spyder_name)
            if(!this.spyderStatus.hasOwnProperty(params.spyder_name)) {
                this.spyderStatus[params.spyder_name] = {running: false}
            }else{
                if(this.spyderStatus[params.spyder_name].running){
                    console.log("spyder is already running")
                    return
                }
            }
            params.browser = this.browser
            params.server_context = this
            try{
                let spyder = new CRAWLER_LIST[params.spyder_name](params)
                spyder.init()
                this.spyderStatus[params.spyder_name].running = true;
                this.spyderStatus[params.spyder_name].spyder_object = spyder;
            }catch (e){
                console.log(e)
            }
        }else{
            console.log(`Spyder ${params.spyder_name} not exists`)
        }
    }

}

let params ={
    browser: {
        headless: false,
        chrome: false
    }
}

async function sleep(ms) {
    await new Promise((r) => setTimeout(r, ms));
}
;(async () => {

    let server = new Server()
    await server.run(params)
    for(let spyders_name of Object.keys(CRAWLER_LIST)) {
        server.sypderRun({
            spyder_name: spyders_name,
            debug: false,
        });
    }

    for(let [spname, value] of Object.entries(server.spyderStatus)){
        console.log(`${spname} ->`)
        console.log(value.spyder_object.logs)
        await sleep(2000)
    }

})();