const router = require("express").Router();

router.use("/", require("./auth.route"));
router.use("/conversation", require("./conversations.route"));
router.use("/conversation-message", require("./message.route"));


module.exports = router;
