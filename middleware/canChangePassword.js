const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth_header = req.headers.authorization;
  const accessToken = auth_header?.split(' ')[1];

  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại" });
      }
      const adminLoggedIn = await Admin.findById(user.adminId);
      if (adminLoggedIn.accessToken !== accessToken) {
        return res.status(403).json({ message: 'Đã có thiết bị khác đăng nhập! Vui lòng thoát và đăng nhập lại' })
      }

      if (!user.permission.includes("changePassword")) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền truy cập" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Vui lòng đăng nhập trước" });
  }
};