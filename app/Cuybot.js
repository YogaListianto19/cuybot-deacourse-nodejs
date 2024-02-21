const TelegramBot = require("node-telegram-bot-api");
const commands = require('../libs/commands');
const { helpTextMessage, invalidCommandMessage } = require("../libs/constant");

class Cuybot extends TelegramBot {
    constructor(token, options){
        super(token, options)
        // this.on("polling_error", (msg) => console.log(msg));
        this.on("message", (data)=> {
            const isInCommands = Object.values(commands).some(keyword => keyword.test(data.text))
            // console.log(Object.values(commands))
            if(!isInCommands){
                console.log(`Invalid Command Executed By ${data.from.username} => ${data.text}`)
                this.sendMessage(data.from.id, invalidCommandMessage, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Panduan Pengguna",
                                    callback_data: "go_to_help"
                                }
                            ]
                        ]
                    }
                })
            }
        })
        this.on("callback_query", (callback)=> {
            const callbackName = callback.data
            if(callbackName == 'go_to_help'){
                this.sendMessage(callback.from.id, helpTextMessage)
            }
        })
    }
    getSticker(){
        this.on("sticker", (data)=> {
            console.log("getSticker Executed By " + data.from.username)
            this.sendMessage(data.from.id, data.sticker.emoji)
        })
    }
    getGreeting(){
        this.onText(commands.greeting, (data)=>{
            const date = new Date()
            console.log("getGreeting Executed By " + data.from.username + ' ' + date)
            this.sendMessage(data.from.id, `hallo jga ${data.from.first_name}!`)
        })
    }
    getQuotes(){
        // fetching quotes API
        this.onText(commands.quote, async (data)=>{
            console.log("getQuotes Executed By " + data.from.username)
            const quoteEndpoint = "https://api.kanye.rest"
            try{
                const apiCall = await fetch(quoteEndpoint)
                const { quote } = await apiCall.json()
                this.sendMessage(data.from.id, quote)
            }catch (error){
                
                this.sendMessage(data.from.id, "maaf silahkan ulangi lagi 🙏")
            }
        })
    }
    getNews(){
        this.onText(commands.news, async (data)=>{
            console.log("getNews Executed By " + data.from.username)
            const newsEndpoint = "https://jakpost.vercel.app/api/category/indonesia"
            const waitMsg = await this.sendMessage(data.from.id, "mohon tunggu sebentar....")
            this.deleteMessage(data.from.id, waitMsg.message_id)
            try {
                const apiCall = await fetch(newsEndpoint)
                const response = await apiCall.json()
                const maxNews = 4
                for(let i = 0; i<maxNews; i++){
                    const news = response.posts[i]
                    const { title, image, headline } = news
                    this.sendPhoto(data.from.id, image, {caption: `Judul: ${title}\nHeadline: ${headline}`})
                    
                }
            } catch (error) {
                console.log(error)
                
            }
        })
    }
    getInfoQuake(){
        this.onText(commands.quake, async (data)=>{
            console.log("getInfoQuake Executed By " + data.from.username)
            const quakeEndpoint = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
            const waitMsg = await this.sendMessage(data.from.id, "mohon tunggu sebentar....")
            this.deleteMessage(data.from.id, waitMsg.message_id)
            try {
                const apiCall = await fetch(quakeEndpoint)
                const response = await apiCall.json()
                // const maxNews = 4 
                const { Tanggal, Jam, Wilayah, Potensi, Dirasakan, Shakemap } = response.Infogempa.gempa
                const imgSourceUrl = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap
                this.sendPhoto(data.from.id, imgSourceUrl, {caption: `Info Gempa: ${Tanggal}\nJam: ${Jam}\nHeadline: \n${Wilayah}\n${Potensi}\n${Dirasakan}`})
                // this.sendMessage(data.from.id, )
                // for(let i = 0; i<maxNews; i++){
                // }
            } catch (error) {
                console.log(error)
                
            }
        })
    }
    getFollow(){
        // ketika user ketik !follow testing, maka kata2 testing akan ditangkap
        this.onText(commands.follow, (data, after)=>{
            console.log("getFollow Executed By " + data.from.username)
            this.sendMessage(data.from.id, `${after[1]}`)
        })
    }
    getHelp(){
        this.onText(commands.help, async (data)=>{
            console.log("getHelp Executed By " + data.from.username)
            this.sendMessage(data.from.id, helpTextMessage)
        })

    }
}

module.exports = Cuybot