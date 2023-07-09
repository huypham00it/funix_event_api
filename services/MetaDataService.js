const EnglishEvent = require("../models/english-event")
const Messages = require("../utils/Messages");
const String = require("../utils/String");

exports.getEvents = async (req, res) => {
    try {
        const englishEvents = await EnglishEvent.find({ status: true }, {}, { sort: { _id: -1 }, limit: 4 })
        return res.status(200).json({ english_events: englishEvents })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: Messages.SERVER_ERROR })
    }
}
