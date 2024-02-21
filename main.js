const Cuybot = require("./app/Cuybot")
require("dotenv").config()

// SET Zona Waktu Jakarta untuk seluruh sistem
process.env.TZ = 'Indonesia/Jakarta';

const token = process.env.TELEGRAM_TOKEN
const options = { polling: true, filePath: false }

const cuybot = new Cuybot(token, options)

const main = () => {
    console.log("preparing feature...");
    cuybot.getSticker()
    cuybot.getGreeting()
    cuybot.getQuotes()
    cuybot.getNews()
    cuybot.getFollow()
    cuybot.getInfoQuake()
    cuybot.getHelp()
}

main()
console.log("🎉 bot is running now! 🎉");