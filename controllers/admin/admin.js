const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin");
const Role = require("../../models/role");
const EnglishEvent = require("../../models/english-event");
const User = require("../../models/user");
const { Types } = require("mongoose");
const { default: Messages } = require("../../utils/Messages");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(422).json({ message: Messages.UNVALID_LOGIN });
    }
    const doMatchPassword = await bcrypt.compare(password, admin.password);
    if (doMatchPassword) {
      const role = await Role.findById(admin.role);
      const token = jwt.sign(
        { email, adminId: admin._id?.toString(), role: role.name, permission: role._id },
        process.env.JWT_SECRET
      );
      admin.accessToken = token;
      await admin.save();
      return res.status(200).json({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: role.name,
        roleDesc: role.desc,
        permission: role._id,
        accessToken: token
      })
    } else {
      return res.status(422).json({ message: Messages.UNVALID_LOGIN });
    }
  } catch (error) {
    return res.status(500).json({ message: Messages.SERVER_ERROR })
  }
}

exports.changePassword = async (req, res) => {
  const { adminId } = req.user;
  const { newPassword } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    return res.status(200).json({ message: "Đổi mật khẩu thành công!" })
  } catch (error) {
    console.log(error);
  }
}

exports.editProfile = async (req, res) => {
  const { adminId } = req.params;
  const { name } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    admin.name = name;
    await admin.save();
    return res.status(200).json({ message: "Chỉnh sửa hồ sơ thành công!" })
  } catch (error) {
    console.log(error);
  }
}

exports.getManager = async (req, res) => {
  try {
    const managers = await Admin.find({ role: { $nin: "64828b9f27aec994b94a1a2c" } }).populate('role');
    const managersResponse = managers.map((man) => {
      return { id: man._id, email: man.email, name: man.name, role: man.role.desc };
    });
    return res.status(200).json(managersResponse);
  } catch (error) {
    console.log(error);
  }
}

exports.getUser = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    const usersResponse = users.map((user) => {
      return { id: user._id, email: user.email, name: user.name, role: user.role.desc };
    });
    return res.status(200).json(usersResponse);
  } catch (error) {
    console.log(error);
  }
}

exports.signUpManager = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const manager = await Admin.findOne({ email });
    if (manager) {
      return res.status(422).json({ message: "Email đã được đăng ký!" });
    }

    const newManager = new Admin({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: new Types.ObjectId("64828bc6eb0ff8b6d5103d69")
    });

    await newManager.save();
    return res.status(200).json({ message: 'Đăng ký quản lý thành công!' });
  } catch (error) {
    console.log(error);
  }
}

exports.deleteManager = async (req, res) => {
  const { managerId } = req.body;
  try {
    await Admin.findByIdAndDelete(managerId);
    return res.status(200).json({ message: "Xóa quản lý thành công!" });
  } catch (error) {
    console.log(error);
  }
}

exports.createEnglishEvent = async (req, res) => {
  const { heading, mentor_info, event_info } = req.body;
  try {
    const newEvent = new EnglishEvent({
      heading, mentor_info, event_info
    });
    await newEvent.save();
    return res.status(200).json({ message: 'Tạo sự kiện thành công!' });
  } catch (error) {
    res.status(500).json({ message: Messages.SERVER_ERROR })
  }
}

exports.readEnglishEvent = async (req, res) => {
  try {
    const events = await EnglishEvent.find();
    return res.status(200).json(events);
  } catch (error) {
    console.log(error);
  }
}

exports.updateEnglishEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, desc, time } = req.body;
  try {
    const updateEvent = await EnglishEvent.findById(eventId);
    updateEvent.name = name;
    updateEvent.desc = desc;
    updateEvent.time = time;
    await updateEvent.save();
    return res.status(200).json({ message: 'Chỉnh sửa sự kiện thành công!' });
  } catch (error) {
    console.log(error);
  }
}

exports.deleteEnglishEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    await EnglishEvent.findByIdAndDelete(eventId);
    return res.status(200).json({ message: "Xóa sự kiện thành công!" });
  } catch (error) {
    console.log(error);
  }
}