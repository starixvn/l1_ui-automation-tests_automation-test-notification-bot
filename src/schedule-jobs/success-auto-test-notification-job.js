import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import { successJobs } from "./../apis/hook-event-handlers/auto-test-event-handler";
import telegramBot from "../bot-apis/telegram-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, function () {
        let message = "";
        if (successJobs.length > 0) {
            message = "Success Jobs: \n";
            successJobs.forEach((successJob) => {
                message += `- ${successJob.gameName} at ${successJob.date.toLocaleString()}\n`;
            });

            successJobs.splice(0, successJobs.length);
        } else {
            message = "There is no job running today";
        }

        telegramBot.sendMessage(appConfig.notifySuccessMessageRoomId, message, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
        });
    });
};
