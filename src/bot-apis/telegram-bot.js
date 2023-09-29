import TelegramBot from "node-telegram-bot-api";
import config from "../configs/app-config";

const bot = new TelegramBot(config.telegramBotToken, { polling: false });

bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (msg?.text?.indexOf("room_id") > 0) {
        bot.sendMessage(chatId, `Current Group Id: ${msg.chat.id}`);
    }
});

bot.on("channel_post", (msg) => {
    const chatId = msg.chat.id;

    if (msg?.text?.indexOf("room_id") > 0) {
        bot.sendMessage(chatId, `Current Group Id: ${msg.chat.id}`);
    }
});

export default bot;
