const { signUpManager, loginAdmin, deleteManager, changePassword, editProfile, getManager, getUser } = require("../../controllers/admin/admin");
const canCreateManager = require('../../middleware/canCreateManager');
const canGetManager = require('../../middleware/canGetManager');
const canGetUser = require('../../middleware/canGetUser');
const canDeleteManager = require('../../middleware/canDeleteManager');
const canChangePassword = require("../../middleware/canChangePassword");
const canEditProfile = require("../../middleware/canEditProfile");
const authorization = require("../../middleware/authorization");
const { getEnglishEvent, createEnglishEvent, updateEnglishEvent, deleteEnglishEvent, updateStatusEnglishEvent } = require("../../services/EnglishEventService");

const router = require("express").Router();

router.post("/login", loginAdmin);
router.post("/change-password", canChangePassword, changePassword);
router.put("/edit-profile/:adminId", canEditProfile, editProfile);
router.get("/managers", canGetManager, getManager);
router.get("/users", canGetUser, getUser);
router.post("/signup", canCreateManager, signUpManager);
router.delete("/delete", canDeleteManager, deleteManager);

/**
 * English event
 */
router.post("/english-event", authorization, createEnglishEvent);
router.get("/english-events", authorization, getEnglishEvent);
router.put("/english-event/:eventId", authorization, updateEnglishEvent);
router.put("/english-event/update-status/:eventId", authorization, updateStatusEnglishEvent);
router.delete("/english-event/:eventId", authorization, deleteEnglishEvent);

module.exports = router;
