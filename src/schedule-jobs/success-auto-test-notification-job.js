import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import telegramBot from "../bot-apis/telegram-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, async function () {
        try {
            const url = await getAllureReport();
            console.log("url", url);
            sendMessageToTelegram(`📋 Daily Smoke Tests: [Link](${url})`);
        } catch (error) {
            console.error("Error in sending message to Telegram:", error);
        }
    });
};

const sendMessageToTelegram = (message) => {
    telegramBot.sendMessage(appConfig.notifySuccessMessageRoomId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
    });
};

async function getAllureReport() {
    try {
        const response = await fetch(`http://10.70.70.120:8080/api/report`, {
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
        return url[0] || "There is no test report for today !";
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getAllureResults() {
    try {
        const response = await fetch(`http://10.70.70.120:8080/api/result`, {
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
    const url = `http://10.70.70.120:8080/api/report`;
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
