import axios from "axios";
import config from "../configs/app-config.js";

class SkynexBot {
    constructor(token = config.skynex.token) {
        this.token = token;
        this.baseUrl = config.skynex.baseUrl;
        this.defaultConversationId = config.skynex.conversationId;
    }

    /**
     * Sends a message to a specific conversation
     * @param {string} message - The message to send
     * @param {string} [conversationId] - The target conversation ID (optional, will use default if not provided)
     * @returns {Promise} - Returns the API response
     */
    async sendMessage(message, conversationId = this.defaultConversationId) {
        try {
            if (!message) {
                throw new Error("Message is required");
            }

            if (!conversationId) {
                throw new Error("No conversation ID provided and no default conversation ID set");
            }

            const encodedMessage = encodeURIComponent(message);
            const url = `${this.baseUrl}?token=${this.token}&message=${encodedMessage}&conversationId=${conversationId}`;

            const response = await axios.post(url);
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error.message);
            throw error;
        }
    }
}

export default SkynexBot;

export const defaultSkynexBot = new SkynexBot();
