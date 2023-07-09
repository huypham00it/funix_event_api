const router = require("express").Router();
const canReadEventUser = require("../../middleware/canReadEventUser");
const canRegisterEventUser = require("../../middleware/canRegisterEventUser");
const { readEnglishEventUser, registerEnglishEventUser } = require("../../controllers/user/user");
const { getEnglishEvent, getEnglishEventBySlug, registerEnglishEvent } = require("../../services/EnglishEventService");
const { getEvents } = require("../../services/MetaDataService");
const authenticated = require("../../middleware/authenticated");

router.get("/events", getEvents)

router.get("/english-events", getEnglishEvent);
router.get("/english-event/:slug", getEnglishEventBySlug);
router.get("/english-event/register/:eventId", authenticated, registerEnglishEvent);

// router.post("/register-english-event", canRegisterEventUser, registerEnglishEventUser);

module.exports = router;
