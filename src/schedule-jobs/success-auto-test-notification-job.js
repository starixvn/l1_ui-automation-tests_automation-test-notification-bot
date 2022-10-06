import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import { successJobs } from "./../apis/hook-event-handlers/auto-test-event-handler";
import telegramBot from "../bot-apis/telegram-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, function () {
        if (successJobs.length > 0) {
            let successMessage = "Success Jobs: \n";
            successJobs.forEach((successJob) => {
                successMessage += `- ${successJob.gameName} at ${successJob.date.toLocaleString()}\n`;
            });

            telegramBot.sendMessage(appConfig.notifySuccessMessageRoomId, successMessage, {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            });

            successJobs.splice(0, successJobs.length);
        }
    });
};
