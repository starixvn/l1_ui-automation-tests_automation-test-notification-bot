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
        const warning = this.getVariableValue(variables, "WARNING");
        const gameId = this.getVariableValue(variables, "GAMEID");
        const stackName = this.getVariableValue(variables, "STACK_NAME");
        const gameName = isNaN(gameId) ? gameId : await this.getGameName(gameId);
        const environment = this.getVariableValue(variables, "ENV");
        const mode = this.getVariableValue(variables, "MODE");

        const excludedModes = ["SMOKE", "SMOKEXD", "SMOKEKENO", "SMOKEMOBI"];

        if (environment.toUpperCase() !== "PROD" && !excludedModes.includes(mode)) {
            return noContent;
        }

        if (this.isSuccessJob(status)) {
            this.addSuccessJob(gameName, stackName, {
                environment,
                gameName,
                date: new Date(),
                jobLink: `[Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`,
                stackName,
            });

            return noContent;
        }
        let projectName;

        switch (stackName) {
            case "l1":
                projectName = "SABA";
                break;
            case "l2":
                projectName = "VG";
                break;
            case "gn":
                projectName = "xD";
                break;
            case "l1mobi":
                projectName = "Saba Mobi";
                break;
            case "l1keno":
                projectName = "Saba Keno";
                break;
            default:
                projectName = "SabaPlay";
                break;
        }
        const messageContent =
            warning === true
                ? `❕ Can not login member site - ${projectName} - ${environment} - ${gameName} - [Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/) `
                : `${statusIcon} - ${projectName} - ${environment} - ${gameName} - [Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`;
        const messageItems = [messageContent];

        return messageItems.join("\n").replace("_", "-");
    }

    addSuccessJob(gameName, stackName, successObject) {
        const existingObject = successJobs.find((job) => job.gameName === gameName && job.stackName === stackName);
        if (existingObject) {
            Object.assign(existingObject, successObject);
        } else {
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

    async getGameName(gameId) {
        const response = await fetch(appConfig.gameConfigurationUrl);
        if (gameId != 0) {
            if (response.ok) {
                const gameConfigs = await response.json();
                const game = gameConfigs.filter((game) => game.id == gameId);

                if (game.length > 0) {
                    return game[0].name;
                } else if (appConfig.gameNames[gameId]) {
                    return appConfig.gameNames[gameId];
                }
            }
            return `GameId: ${gameId}`;
        } else {
            return "GameLobby";
        }
    }
}

export const shareVariables = {
    successJob: successJobs,
};
