import express from "express";
import GitLabHookApi from "./apis/gitlab-hook-api";
import appConfig from "./configs/app-config";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Site is running");
});

const gitlabHookApi = new GitLabHookApi(app);
gitlabHookApi.registerRoutes();

app.listen(appConfig.port, () => {
    console.log(`Site is listening at http://localhost:${appConfig.port}`);
});
