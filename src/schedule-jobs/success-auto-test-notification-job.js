import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import { successJobs } from "./../apis/hook-event-handlers/auto-test-event-handler";
import telegramBot from "../bot-apis/telegram-bot";

const BATCH_SIZE = 100;

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, function () {
        sendMessageByStack("l1", successJobs);
        sendMessageByStack("l2", successJobs);
        sendMessageByStack("ultra888", successJobs);
        sendMessageByStack("gn", successJobs);
        successJobs.splice(0, successJobs.length);       
    });
};

const sendMessageByStack = (stackName, successJobs) =>  {
    const successJobsByStack = successJobs.filter(job => job.stackName === stackName);
    const projectName = stackName === "l1" ? "SG" : stackName === "l2" ? "VG" : stackName === "gn" ? "xD" : "Ultra888";
    if(successJobsByStack.length > 0){
        for (let i = 0; i < successJobsByStack.length; i += BATCH_SIZE) {
            let message = `Success Jobs - ${projectName} : \n`;
            const successJobsByBatch = successJobsByStack.slice(i, i + BATCH_SIZE);
            successJobsByBatch.forEach((successJob, index) => {
                message += `${index + i + 1} - ${successJob.gameName} at ${successJob.date.toUTCString()} - ${successJob.jobLink}\n`;
            });  
            
            sendMessageToTelegram(message);
        }             
    }
    else{
        sendMessageToTelegram(`There is no job running today for ${projectName}`);        
    }              
}

const sendMessageToTelegram = (message) => {
    telegramBot.sendMessage(appConfig.notifySuccessMessageRoomId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
    });
}
