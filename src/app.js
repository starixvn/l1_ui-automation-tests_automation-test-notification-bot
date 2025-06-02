import express from "express";
import GitLabHookApi from "./apis/gitlab-hook-api";
import appConfig from "./configs/app-config";
import successAutoTestNotificationJob from "./schedule-jobs/success-auto-test-notification-job";
import { defaultSkynexBot } from "./bot-apis/skynex-bot";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`Site is running on ${appConfig.env}`);
});

const gitlabHookApi = new GitLabHookApi(app);
gitlabHookApi.registerRoutes();
successAutoTestNotificationJob();

app.listen(appConfig.port, () => {
    console.log(`Site is listening at http://localhost:${appConfig.port}`);
});

defaultSkynexBot.sendMessage("✅ Automation Test Bot has been started.");
