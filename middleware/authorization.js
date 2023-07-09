const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");
const Messages = require('../utils/Messages');
const Role = require('../models/role');

module.exports = (req, res, next) => {
    const auth_header = req.headers.authorization;
    const accessToken = auth_header?.substring(7, auth_header.length)

    if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: Messages.SESSION_EXPIRED });
            }
            const admin = await Admin.findById(user.adminId);
            if (admin.accessToken !== accessToken) {
                return res.status(403).json({ message: Messages.LOGGED_ANOTHER_DEVICE })
            }

            const role = await Role.findById(user.permission)
            const allow = role.permission.find(item => item.route === req.route.path && item.method === req.method)

            if (!allow) {
                return res
                    .status(403)
                    .json({ message: Messages.UNAUTHORISED });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: Messages.AUTHENTICATED_REQUIRED });
    }
};