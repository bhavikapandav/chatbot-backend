const router = require("express").Router();
const {
    UserModule: { MessageController },
} = require("../../../controllers/v1");
// const { } = require("../../../validations")
const { AuthTokenMiddleware: { userAuth } } = require("../../../middlewares")
const MessageCtrl = new MessageController();


router.post("/:conversationId/send", userAuth, async (req, res) => {
    let result = await MessageCtrl.cerate(req);
    res.status(result.status).send(result);
})

router.get("/list", userAuth, async (req, res) => {
    let result = await MessageCtrl.list(req);
    res.status(result.status).send(result);
})

router.post("/:conversationId/send", userAuth, async (req, res) => {
    let result = await MessageCtrl.updatePinnedStatus(req);
    res.status(result.status).send(result);
})

router.put("/:conversationId/archive-status/:type", userAuth, async (req, res) => {
    let result = await MessageCtrl.updateArchivedStatus(req);
    res.status(result.status).send(result);
})

router.delete("/:conversationId", userAuth, async (req, res) => {
    let result = await MessageCtrl.deleteConversation(req);
    res.status(result.status).send(result);
})

module.exports = router;
