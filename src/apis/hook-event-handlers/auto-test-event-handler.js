import HookEventHandlerBase from "./hook-event-handler-base";
import appConfig from "../../configs/app-config";

const icons = {
    success: "✅",
    failed: "❌",
    canceled: "⚠:Cancel",
};
const noContent = "";
export const successJobs = [];

export default class AutoTestEventHandler extends HookEventHandlerBase {
    constructor() {
        const hookEventName = "pipeline";
        super(hookEventName);
    }

    isSuccessJob(status) {
        return status == "success";
    }

    async buildAndFormatMessage(hookEvent) {
        const variables = hookEvent.object_attributes?.variables;
        const objectAttributes = hookEvent.object_attributes;
        const status = objectAttributes?.status;

        if (!variables || !objectAttributes || !icons[status]) {
            return noContent;
        }

        const statusIcon = icons[status];
        const jobId = hookEvent?.builds?.length > 0 ? hookEvent?.builds[0].id : 0;
        const gameId = this.getVariableValue(variables, "GAMEID");
        const stackName = this.getVariableValue(variables, "STACK_NAME");
        const gameName = isNaN(gameId) ? gameId : await this.getGameName(gameId,stackName);
        const environment = this.getVariableValue(variables, "ENV");
        const mode = this.getVariableValue(variables, "MODE");

        if (environment.toUpperCase() != "PROD" || mode != "SMOKE") {
            return noContent;
        }

        if (this.isSuccessJob(status)) {
            this.addSuccessJob(gameName, stackName, {
                environment,
                gameName,
                date: new Date(),
                jobLink: `[Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`,
                stackName
            });
            
            return noContent;
        }

        const messageItems = [`${statusIcon} - ${stackName} - ${environment} - ${gameName} - [Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`];

        return messageItems.join("\n").replace("_", "-");
    }

    addSuccessJob(gameName, stackName, successObject){
        const existingObject = successJobs.find(job => job.gameName === gameName && job.stackName === stackName);
        if(existingObject){
            Object.assign(existingObject, successObject);
        }
        else{
            successJobs.push(successObject);
        }
    }

    getVariableValue(variables, key) {
        const keyValuePairs = variables.filter((pair) => pair.key == key);
        if (keyValuePairs.length > 0) {
            return keyValuePairs[0].value;
        }

        return "";
    }

    async getGameName(gameId,stackName) {
        const response = await fetch(appConfig.gameConfigurationUrl);
        if (gameId!= 0) {
            if (response.ok) {
                const gameConfigs = await response.json();
                const game = gameConfigs.filter((game) => game.id == gameId);
    
                if (game.length > 0) {
                    return game[0].name;
                }
            } 
            return `GameId: ${gameId}`;
        }
        else {
            if (stackName == "healthCheck") {
                return "Download Saba App"
            }
            return "GameLobby"
        }
    }
}

export const shareVariables = {
    successJob: successJobs,
};
