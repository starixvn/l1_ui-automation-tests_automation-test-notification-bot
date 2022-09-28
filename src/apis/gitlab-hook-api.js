import telegramBot from "../bot-apis/telegram-bot";
import NoteEventHandler from "./hook-event-handlers/note-event-handler";
import MergeRequestEventHandler from "./hook-event-handlers/merge-request-event-handler";
import AutoTestEventHandler from "./hook-event-handlers/auto-test-event-handler";

const eventHandlers = [new NoteEventHandler(), new MergeRequestEventHandler(), new AutoTestEventHandler()];

export default class GitlabHookApi {
    constructor(expressApp) {
        this.expressApp = expressApp;
    }

    registerRoutes() {
        this.expressApp.post("/", async (req, res) => {
            const roomId = req.headers["x-gitlab-token"];

            if (!roomId) {
                res.send("Room Id is not valid");
                return;
            }

            const hookEventData = req.body;

            if (!hookEventData) {
                res.send("Hook data is not valid");
                return;
            }

            for (const eventHandler of eventHandlers) {
                if (eventHandler.handleEvent(hookEventData)) {
                    const message = await eventHandler.buildAndFormatMessage(hookEventData);

                    this.sendTelegramMessage(roomId, message);

                    break;
                }
            }

            res.send("Received hook event");
        });
    }

    sendTelegramMessage(roomId, message) {
        if (message != null && message != "") {
            telegramBot.sendMessage(roomId, message, {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            });
        }
    }
}
