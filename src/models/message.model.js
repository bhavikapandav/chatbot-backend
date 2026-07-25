const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    conversation_fk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    parent_message_fk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {  //message
        type: String,
        // required: true
    },
    model: {
        type: String,
        default: null
    },
    prompt_tokens: {
        type: Number,
        default: 0
    },
    completion_tokens: {
        type: Number,
        default: 0
    },

    total_tokens: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["pending", "completed", "error"],
        default: "completed",
    },
    error_message: {
        type: String,
        default: null,
    },

}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;