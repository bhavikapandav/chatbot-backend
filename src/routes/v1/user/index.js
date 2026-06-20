const router = require("express").Router();

router.use("/", require("./auth.route"));


module.exports = router;
