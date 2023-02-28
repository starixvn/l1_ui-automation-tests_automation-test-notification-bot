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
        const gameName = isNaN(gameId) ? gameId : await this.getGameName(gameId);
        const environment = this.getVariableValue(variables, "ENV");

        if (environment.toUpperCase() != "PROD") {
            return noContent;
        }

        if (this.isSuccessJob(status)) {
            successJobs.push({
                environment,
                gameName,
                date: new Date(),
                jobLink: `[Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`,
            });
            return noContent;
        }

        const messageItems = [`${statusIcon} - ${environment} - ${gameName} - [Link](${hookEvent.project?.web_url}/-/jobs/${jobId}/)`];

        return messageItems.join("\n").replace("_", "-");
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
        if (response.ok) {
            const gameConfigs = await response.json();
            const game = gameConfigs.filter((game) => game.id == gameId);

            if (game.length > 0) {
                return game[0].name;
            }
        }

        return `GameId: ${gameId}`;
    }
}

export const shareVariables = {
    successJob: successJobs,
};
