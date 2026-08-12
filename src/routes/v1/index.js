const router = require("express").Router();

router.use(
  "/user",
  require("./user")
  /*
    #swagger.auto = false
    #swagger.tags = ['User']
  */
);



module.exports = router;
