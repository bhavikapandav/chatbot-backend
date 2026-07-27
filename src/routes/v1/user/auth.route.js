const router = require("express").Router();
const {
    UserModule: { AuthController },
} = require("../../../controllers/v1");
// const { } = require("../../../validations")
const { AuthTokenMiddleware: { userAuth } } = require("../../../middlewares");
const authCtrl = new AuthController();

router.post("/register", async (req, res) => {
    let result = await authCtrl.register(req);
    res.status(result.status).send(result);
})

router.post("/login", async (req, res) => {
    let result = await authCtrl.login(req);
    res.status(result.status).send(result);
})
router.get("/:userId/details", userAuth, async (req, res) => {
    let result = await authCtrl.userDetails(req);
    res.status(result.status).send(result);
})
router.post("/:userId/update", userAuth, async (req, res) => {
    let result = await authCtrl.updateUser(req);
    res.status(result.status).send(result);
})
router.put("/:userId/update", userAuth, async (req, res) => {
    let result = await authCtrl.updateUser(req);
    res.status(result.status).send(result);
})

router.post("/:userId/edit-profile", userAuth, async (req, res) => {
    let result = await authCtrl.updateUser(req);
    res.status(result.status).send(result);
})
module.exports = router;
