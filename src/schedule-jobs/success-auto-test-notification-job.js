import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import { defaultSkynexBot } from "../bot-apis/skynex-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, async function () {
        try {
            let url = await getAllureReport();
            url = url.replace("10.10.50.160", "test-reports.lumigame.com");
            console.log("url", url);
            sendMessageToTelegram(`📋 Daily Smoke Tests: ${url}`);
        } catch (error) {
            console.error("Error in sending message to Telegram:", error);
        }
    });
};

const sendMessageToTelegram = (message) => {
    defaultSkynexBot.sendMessage(message);
};

async function getAllureReport() {
    try {
        const response = await fetch(`http://test-reports.lumigame.com:8080/api/report`, {
            method: "GET",
            headers: {
                Accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const jsonData = await response.json();
        const url = jsonData.map((element) => element.url);
        return url[0];
    } catch (error) {
        console.error("Error fetching data:", error);
        return "http://test-reports.lumigame.com:8080/ui/";
    }
}

async function getAllureResults() {
    try {
        const response = await fetch(`http://10.10.50.160:8080/api/result`, {
            method: "GET",
            headers: {
                Accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function generateReport(reportData) {
    const url = `http://10.10.50.160:8080/api/report`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Expect JSON response for error handling
        },
        body: JSON.stringify(reportData),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
            throw new Error(`Report generation failed: ${errorData.message}`);
        }

        return response.json(); // Get the generated report data (if any)
    } catch (error) {
        console.error("Error generating report:", error);
        throw error; // Re-throw for external handling
    }
}
