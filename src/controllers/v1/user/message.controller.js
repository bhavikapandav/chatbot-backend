const { ApiResponse: { successResponse, failConflict, serverError, failAuthorization, badRequest, notFound }, MessageResponse: m } = require("../../../responses")
const { commonUtils: { isEmpty, getFilterClause, generateSlug }, jwtUtils: { generateToken }, bcryptUtils: { hashPassword, comparePassword } } = require("../../../utils")
const { DataService: { ConversationService, MessageService }, IntegrationService: { GeminiService } } = require("../../../services");
const { Message } = require("../../../models");
const { default: mongoose } = require("mongoose");



class ConversationController {
    constructor() {
        this.conversationService = new ConversationService();
        this.messageService = new MessageService();

    }
    // create message 
    cerate = async (req) => {
        let assistantMessage = null;
        try {
            console.log("req.headers=====================", req.headers);
            const { userDetails: { userId } } = req.headers
            const { conversationId } = req.params;
            console.log("--", req.params);
            console.log("---", req.params.conversationId);

            const { message } = req.body;

            if (!message) {
                return badRequest("Message is required")
            }
            if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                return badRequest("Invalid conversationId");
            }
            const conversation = await this.conversationService.findById(conversationId);

            console.log("conversation=============", conversation);

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found.", null);
            }
            const messagePayload = {
                conversation_fk: conversationId,
                role: "user",
                content: message,
                model: null,
                status: "completed",
            }

            const userMessage = await this.messageService.create(messagePayload);

            console.log("userMessage==============", userMessage);

            const assistantMessagePayload = {
                conversation_fk: conversationId,
                parent_message_fk: userMessage._id,
                role: "assistant",
                content: "",
                status: "pending",
            }
            assistantMessage = await this.messageService.create(assistantMessagePayload);

            const history = await this.messageService.findAllScoped({
                where: {
                    conversation_fk: conversationId,
                },
                sort: {
                    createdAt: 1,
                },
            })
            console.log("history==========", history);

            const contents = history.map((msg) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [
                    {
                        text: msg.content,
                    },
                ],
            }));
            console.log("contents=============", contents);

            // Call Gemini
            const geminiResponse = await GeminiService.generateResponse(contents);
            console.log("geminiResponse================", geminiResponse);
            const botReply =
                geminiResponse?.text || "";

            // Store assistant's response with token data
            const assistantMessageUpdatePayload = {
                conversation_fk: conversationId,
                parent_message_fk: userMessage._id,
                role: "assistant",
                content: botReply,
                model: geminiResponse.model,
                prompt_tokens:
                    geminiResponse?.promptTokenCount || 0,
                completion_tokens:
                    geminiResponse?.candidatesTokenCount || 0,
                total_tokens:
                    geminiResponse?.totalTokenCount || 0,
                status: "completed",
                error_message: null,
            }

            assistantMessage = await this.messageService.updateOne(
                {
                    _id: assistantMessage._id
                },
                assistantMessageUpdatePayload
            );


            await this.conversationService.updateOne({ _id: conversationId }, {
                last_message: botReply,
                last_message_at: new Date(),
                updatedAt: new Date(),
                $inc: {
                    total_messages: 2,
                },
            });
            // console.log("assistantMessage==================", assistantMessage);

            // const resultData = {
            //     conversationId: assistantMessage.conversationId,
            //     role: assistantMessage.role,
            //     content: assistantMessage.content,
            //     model: assistantMessage.model,
            //     promptTokens: assistantMessage.promptTokens,
            //     completionTokens: assistantMessage.completionTokens,
            //     totalTokens: assistantMessage.totalTokens,
            //     createdAt: assistantMessage.createdAt
            // };

            return successResponse(1, "success", "api", assistantMessage);
        } catch (error) {
            console.log("error=============", error);
            await this.messageService.updateOne(
                assistantMessage._id,
                {
                    status: "error",
                    error_message: error.message,
                }
            );

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    }
    list = async (req) => {
        try {
            const { devicename } = req.headers;
            const { currentPage, pageSize, isPaginate, search } = req.query;

            const options = {
                sort: { is_pinned: -1, updatedAt: -1 }
            };

            if (!isEmpty(search)) {
                options.where = {
                    ...options.where,
                    ...getFilterClause({
                        fields: ["title"],
                        search,
                    }),
                };
            }
            console.log("option================", options);

            if (isPaginate) {
                options.currentPage = currentPage;
                options.pageSize = pageSize;
                options.is_paginate = isPaginate;
            }

            const conversation = await this.conversationService.findAllScoped(options);

            return successResponse(
                1,
                "Retrieve conversation list successfully",
                devicename,
                conversation
            );
        } catch (error) {
            console.log("error----------", error);

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    };

    updatePinnedStatus = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { conversationId, type } = req.params;

            if (isEmpty(conversationId)) {
                return badRequest("Conversation id is required");
            }

            if (!["pin", "unpin"].includes(type)) {
                return badRequest("Type must be pin or unpin");
            }

            const conversation = await this.conversationService.updateOne(
                {
                    _id: conversationId,
                    user_fk: userId,
                    is_Deleted: { $ne: true }
                },
                {
                    is_pinned: type == "pin" ? true : false
                }
            );

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found");
            }

            return successResponse(
                1,
                `Conversation ${type} successfully!`,
                devicename,
                conversation
            );
        } catch (error) {
            console.log("error----------", error);

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    };

    updateArchivedStatus = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { conversationId, type } = req.params;

            if (isEmpty(conversationId)) {
                return badRequest("Conversation id is required");
            }

            if (!["archive", "unarchive"].includes(type)) {
                return badRequest("Type must be archive or unarchive");
            }
            const conversation = await this.conversationService.updateOne(
                {
                    _id: conversationId,
                    user_fk: userId,
                    is_Deleted: { $ne: true }
                },
                {
                    is_archived: type == "archive" ? true : false
                }
            );

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found");
            }

            return successResponse(
                1,
                `Conversation ${type} successfully!`,
                devicename,
                conversation
            );
        } catch (error) {
            console.log("error----------", error);

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    };

    deleteConversation = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { conversationId } = req.params;

            if (isEmpty(conversationId)) {
                return badRequest("Conversation id is required");
            }

            const conversation = await this.conversationService.softDelete({
                _id: conversationId,
                user_fk: userId,
                is_Deleted: { $ne: true }
            });

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found");
            }

            return successResponse(
                1,
                "Conversation deleted successfully!",
                devicename,
                conversation
            );
        } catch (error) {
            console.log("error----------", error);

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    };
}

module.exports = ConversationController
