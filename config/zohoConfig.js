const dotenv = require('dotenv')
const path = require('path');

dotenv.config({
    path:path.resolve(__dirname,'.env')
});


module.exports = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
    access_token: "",
    redirect_uri: "",
    user_name:process.env.USER_NAME,
    email: process.env.EMAIL




}