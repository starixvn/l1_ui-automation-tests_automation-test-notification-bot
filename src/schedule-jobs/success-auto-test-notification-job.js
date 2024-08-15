import schedule from "node-schedule";
import appConfig from "../configs/app-config";
import telegramBot from "../bot-apis/telegram-bot";

export default () => {
    schedule.scheduleJob(appConfig.successNotificationCron, async function () {
        try {
            const data = await fetchData();
            console.log(data);
            
            const uuid = data.map(element => element.uuid);  
            let generatedReport = null; 
            const reportData = {
              reportSpec: { 
                "path": [
                  "DailySmokeTests"
                ],
                "executorInfo": {
                  "name": "CICD",
                  "type": "GitLab",
                  "buildName": "https://git3.nexdev.net/l1/ui-automation-tests/automation-tests/-/pipelines",
                  "buildUrl": "https://git3.nexdev.net/l1/ui-automation-tests/automation-tests/-/pipelines",
                  "reportName": "DailySmokeTests",
                  "reportUrl": "reportUrl"
                }
              },
              results: uuid,
              deleteResults: false
            };

            if (uuid.length > 0) {
                generatedReport = await generateReport(reportData);
                console.log("Report generated:", generatedReport);
            } else {
                console.log("No Allure Result Found");
            }

            sendMessageToTelegram(`📋 Daily Smoke Tests: [Link](http://10.70.70.120:8080/allure/reports/${generatedReport.uuid}/)`);
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

async function fetchData() { 
    try {
      const response = await fetch(`http://10.70.70.120:8080/api/result`, {
        method: 'GET',
        headers: {
          Accept: '*/*'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const jsonData = await response.json();
      return jsonData; // Return the JSON data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

async function generateReport(reportData) {
    const url = `http://10.70.70.120:8080/api/report`; 
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json' // Expect JSON response for error handling
      },
      body: JSON.stringify(reportData)
    };
  
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Report generation failed: ${errorData.message}`);
      }
  
      return response.json(); 
    } catch (error) {
      console.error("Error generating report:", error);
      throw error; 
    }
  }
