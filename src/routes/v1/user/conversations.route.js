const router = require("express").Router();
const {
    UserModule: { ConversationController },
} = require("../../../controllers/v1");
// const { } = require("../../../validations")
const { AuthTokenMiddleware: { userAuth } } = require("../../../middlewares")
const ConversationCtrl = new ConversationController();


router.post("/", userAuth, async (req, res) => {
    let result = await ConversationCtrl.cerate(req);
    res.status(result.status).send(result);
})

router.get("/list", userAuth, async (req, res) => {
    let result = await ConversationCtrl.list(req);
    res.status(result.status).send(result);
})

router.put("/:conversationId/pin-status/:type", userAuth, async (req, res) => {
    let result = await ConversationCtrl.updatePinnedStatus(req);
    res.status(result.status).send(result);
})

router.put("/:conversationId/archive-status/:type", userAuth, async (req, res) => {
    let result = await ConversationCtrl.updateArchivedStatus(req);
    res.status(result.status).send(result);
})

router.get("/:conversationId/messages", userAuth, async (req, res) => {
    let result = await ConversationCtrl.getMessages(req);
    res.status(result.status).send(result);
})

router.delete("/:conversationId", userAuth, async (req, res) => {
    let result = await ConversationCtrl.deleteConversation(req);
    res.status(result.status).send(result);
})



module.exports = router;
