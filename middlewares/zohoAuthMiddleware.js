const {getAccessToken } = require("../utils/tokenManager");
const config = require("../config/zohoConfig");
const logger = require('../logger')



module.exports = async (req, res, next) => {
    try {
        if (!config.access_token) {
            logger.debug("Access token not found, fetching new token.. ")
            await getAccessToken();
        }
        req.access_token = config.access_token;
        logger.debug(`Access Token found: ${req.access_token}`);
        logger.info("Access Toke Found")
        
        next();
    } catch (error) {
        logger.error(`Error in zoho Auth Middleware: ${error}`);
    }
};

