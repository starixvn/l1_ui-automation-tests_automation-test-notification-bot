import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import { successJobs } from "./../apis/hook-event-handlers/auto-test-event-handler";
import telegramBot from "../bot-apis/telegram-bot";

const BATCH_SIZE = 200;

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, function () {
        sendMessageByStack("l1", successJobs);
        sendMessageByStack("l2", successJobs);
        sendMessageByStack("SabaPlay", successJobs);
        sendMessageByStack("gn", successJobs);
        sendMessageByStack("l1mobi", successJobs);
        sendMessageByStack("l1keno", successJobs);
        sendMessageByStack("l2mobi", successJobs);
        sendMessageByStack("l2keno", successJobs);
        sendMessageByStack("l1is", successJobs);
        successJobs.splice(0, successJobs.length);       
    });
};

const sendMessageByStack = (stackName, successJobs) =>  {
    const successJobsByStack = successJobs.filter(job => job.stackName === stackName);
    const projectNameMap = {
        l1: "SABA",
        l2: "VG",
        gn: "xD",
        l1mobi: "Saba-Mobi",
        l1keno: "Saba-Keno",
        l2mobi: "VG-Mobi",
        l2keno: "VG-Keno",
        l1is: "Saba-Instant Play",
        l2is: "VG-Instant Play",
      };
      
      const projectName = projectNameMap[stackName] || "Saba Play";

    if(successJobsByStack.length > 0){
        for (let i = 0; i < successJobsByStack.length; i += BATCH_SIZE) {
            let message = `✅ - ${projectName} : \n`;
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
