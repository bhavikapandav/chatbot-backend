const router = require("express").Router();
const {
    UserModule: { AuthController },
} = require("../../../controllers/v1");
// const { } = require("../../../validations")
const authCtrl = new AuthController();

router.post("/register", async (req, res) => {
    let result = await authCtrl.register(req);
    res.status(result.status).send(result);
})

router.post("/login", async (req, res) => {
    let result = await authCtrl.login(req);
    res.status(result.status).send(result);
})

module.exports = router;
