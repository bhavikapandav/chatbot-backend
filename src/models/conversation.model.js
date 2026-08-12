// ---------- conversation.model.js ----------
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        user_fk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        is_pinned: {
            type: Boolean,
            default: false,
        },

        is_archived: {
            type: Boolean,
            default: false,
        },
        last_message: {
            type: String,

        },
        last_message_at: {
            type: Date,
            default: null,
        },
        total_messages: {
            type: Number,
            default: 0,
        },
        is_Deleted: { type: Boolean, default: false }, // soft-delete flag
    },
    {
        timestamps: true,
    }
);

// TRICK 1: Auto-filter out soft-deleted docs on every find/findOne/countDocuments
// unless query explicitly opts out via .setOptions({ skipSoftDelete: true })
// NOTE: no `next` param — Mongoose treats zero-arity functions as synchronous
// middleware and auto-advances after they run. This avoids the
// "next is not a function" issue that occurs with countDocuments hooks.
function autoExcludeDeleted() {
    if (!this.getOptions().skipSoftDelete) {
        this.where({ is_Deleted: { $ne: true } }); // matches schema field exactly
    }
}

conversationSchema.pre("find", autoExcludeDeleted);
conversationSchema.pre("findOne", autoExcludeDeleted);
conversationSchema.pre("countDocuments", autoExcludeDeleted);

// TRICK 2: Query helper — lets you write model.find().withDeleted()
conversationSchema.query.withDeleted = function () {
    return this.setOptions({ skipSoftDelete: true });
};

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;