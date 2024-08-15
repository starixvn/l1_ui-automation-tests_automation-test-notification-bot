import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import telegramBot from "../bot-apis/telegram-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, async function () {
        try {
            const url = await getAllureReport();
            console.log(url);       
            // sendMessageToTelegram(`📋 Daily Smoke Tests: [Link](${url})`);
        } catch (error) {
            console.error("Error in sending message to Telegram:", error);
        }
    });
};

const sendMessageToTelegram = (message) => {
    telegramBot.sendMessage(appConfig.notifySuccessMessageRoomId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
    });
};

async function getAllureReport() {
    try {
        const response = await fetch(`http://10.70.70.120:8080/api/report`, {
            method: "GET",
            headers: {
                Accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const jsonData = await response.json();
        const url = jsonData.map((element) => element.url);
        return url[0] || "There is no test report for today !";
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}