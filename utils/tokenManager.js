const axios = require('axios');
const config = require('../config/zohoConfig');
const logger = require("../logger")

async function getAccessToken() {
    try {
        console.log("config client id ", config.client_id);
        console.log("config client secret is ", config.client_secret);
        console.log("config refresh token is ", config.refresh_token)
        const response = await axios.post(
            "https://accounts.zoho.in/oauth/v2/token",
            null,
            {
                params: {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    refresh_token: config.refresh_token,
                    grant_type: "refresh_token"
                }
            }
        );

        config.access_token = response.data.access_token;
        console.log("token data is ", response.data)
        return response.data.access_token;
    } catch (error) {
        logger.error(`Error fetching access token: ${error} `);
        throw error;
    }
}

module.exports = { getAccessToken };
