const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");
const Messages = require('../utils/Messages');
const Role = require('../models/role');
const {
    OAuth2Client,
} = require('google-auth-library');

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
);

module.exports = async (req, res, next) => {
    const auth_header = req.headers.authorization;
    const accessToken = auth_header?.substring(7, auth_header.length)

    if (accessToken) {
        const response = await oAuth2Client.verifyIdToken({ idToken: accessToken })
        req.user = response.getPayload()
        next()
    } else {
        res.status(401).json({ message: Messages.AUTHENTICATED_REQUIRED });
    }
};