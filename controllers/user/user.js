const { Types } = require("mongoose");
const EnglishEvent = require("../../models/english-event");
const User = require("../../models/user");
const Messages = require("../../utils/Messages");

exports.readEnglishEventUser = async (req, res) => {
  try {
    const events = await EnglishEvent.find();
    return res.status(200).json(events);
  } catch (error) {
    console.log(error);
  }
}

exports.registerEnglishEventUser = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    const findEvent = user.event.find(event => event._id.toString() === eventId);
    if (findEvent) {
      return res.json("Sự kiện đã được đăng ký trước. Vui lòng chọn mới.");
    }
    user.event.push(new Types.ObjectId(eventId));
    await user.save();
    return res.json("Đăng ký sự kiện thành công");
  } catch (error) {
    return res.status(500).json({ message: Messages.SERVER_ERROR })
    console.log(error);
  }
}