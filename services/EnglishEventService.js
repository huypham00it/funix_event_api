const EnglishEvent = require("../models/english-event")
const Messages = require("../utils/Messages");
const String = require("../utils/String");

exports.createEnglishEvent = async (req, res) => {
    try {
        const heading = req.body.heading

        const event = await EnglishEvent.findOne({ slug: String.toSlug(heading) })

        if (event) {
            return res.status(400).json({ message: Messages.EVENT_EXISTED });
        }

        const newEvent = new EnglishEvent({ ...req.body, register: [], slug: String.toSlug(heading), status: false });
        await newEvent.save();
        return res.status(200).json({ message: Messages.CREATE_EVENT_SUCCESS });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: Messages.SERVER_ERROR })
    }
}

exports.getEnglishEvent = async (req, res) => {
    try {
        const events = await EnglishEvent.find();
        return res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: Messages.SERVER_ERROR })
    }
}

exports.updateEnglishEvent = async (req, res) => {
    const { eventId } = req.params;
    const { heading, description, mentor_info, event_info } = req.body;
    try {
        const event = await EnglishEvent.findOne({ slug: String.toSlug(heading) })

        if (event && event.id !== eventId) {
            return res.status(400).json({ message: Messages.EVENT_EXISTED });
        }

        await EnglishEvent.findByIdAndUpdate(eventId, { heading, mentor_info, event_info, description, slug: String.toSlug(heading) });
        return res.status(200).json({ message: Messages.UPDATE_EVENT_SUCCESS });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: Messages.SERVER_ERROR });
    }
}

exports.updateStatusEnglishEvent = async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body;
    try {
        const event = await EnglishEvent.findByIdAndUpdate(eventId, { status });
        if (event) {
            return res.status(200).json({ message: Messages.UPDATE_EVENT_SUCCESS });
        }

        return res.status(400).json({ message: Messages.NOT_FOUND })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: Messages.SERVER_ERROR });
    }
}

exports.deleteEnglishEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const deletedEvent = await EnglishEvent.findByIdAndDelete(eventId);
        if (deletedEvent) {
            return res.status(200).json({ message: Messages.DELETE_EVENT_SUCCESS });
        }
        return res.status(400).json({ message: Messages.NOT_FOUND });
    } catch (error) {
        return res.status(500).json({ message: Messages.SERVER_ERROR });
    }
}

/**
 * User
 */
exports.getEnglishEventBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const event = await EnglishEvent.findOne({ slug })

        if (!event) {
            return res.status(400).json(Messages.NOT_FOUND)
        }

        return res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: Messages.SERVER_ERROR })
    }
}

exports.registerEnglishEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await EnglishEvent.findById(eventId)

        if (!event) {
            return res.status(400).json(Messages.NOT_FOUND)
        }

        const isRegisted = event.register.find(item => item.email === req.user.email)

        if (isRegisted) {
            return res.status(400).json({ message: Messages.REGISTERED })
        }

        const user = { name: req.user.name, email: req.user.email }
        await EnglishEvent.updateOne({ _id: eventId }, { $push: { register: user } })

        return res.status(200).json({ message: Messages.REGISTER_SUCCESS });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: Messages.SERVER_ERROR })
    }
}