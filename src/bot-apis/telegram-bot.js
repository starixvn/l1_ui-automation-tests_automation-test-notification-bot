import TelegramBot from "node-telegram-bot-api";
import config from "../configs/app-config";

const bot = new TelegramBot(config.telegramBotToken, { polling: true });

bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Current Group Id: ${msg.chat.id}`);
});

bot.on("channel_post", (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Current Group Id: ${msg.chat.id}`);
});

export default bot;
