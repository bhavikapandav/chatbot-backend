const { ApiResponse: { successResponse, failConflict, serverError, failAuthorization, badRequest, notFound }, MessageResponse: m } = require("../../../responses")
const { commonUtils: { isEmpty, getFilterClause, generateSlug }, jwtUtils: { generateToken }, bcryptUtils: { hashPassword, comparePassword } } = require("../../../utils")
const { DataService: { ConversationService, MessageService } } = require("../../../services");
const mongoose = require("mongoose");



class ConversationController {
    constructor() {
        this.conversationService = new ConversationService();
        this.messageService = new MessageService();
    }
    // create conversations   when user click on new chat 
    cerate = async (req) => {
        try {
            console.log("req.headers=====================", req.headers);
            const { userDetails: { userId } } = req.headers

            const { first_message } = req.body;
            console.log("title----------------", first_message.slice(0, 40));

            const conversationPayload = {
                user_fk: userId,
                title: first_message.slice(0, 40), // auto-title from first message
                slug: generateSlug(first_message),
                is_pinned: false,
                is_archived: false
            }

            const ceratedConversation = await this.conversationService.create(conversationPayload);
            console.log("====", ceratedConversation);


            return successResponse(1, "conversation created successfully done... ", "api", {
                ceratedConversation
            })
        } catch (error) {
            console.log("error=============", error);
            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    }
    list = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { currentPage, pageSize, isPaginate, search } = req.query;

            const options = {
                where: { user_fk: userId },
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

    getMessages = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { conversationId } = req.params;
            const { currentPage, pageSize, isPaginate } = req.query;

            if (isEmpty(conversationId)) {
                return badRequest("Conversation id is required");
            }
            if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                return badRequest("Invalid conversationId");
            }

            const conversation = await this.conversationService.findOne({
                _id: conversationId,
                user_fk: userId,
                is_Deleted: { $ne: true }
            });

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found");
            }

            const options = {
                where: {
                    conversation_fk: conversationId,
                    is_deleted: { $ne: true },
                    status: "completed",
                    content: { $ne: null }
                },
                sort: { createdAt: 1 }
            };

            const isPaginateBool = isPaginate === undefined ? true : (isPaginate === "true" || isPaginate === true);
            options.currentPage = currentPage || 1;
            options.pageSize = pageSize || 10;
            options.is_paginate = isPaginateBool;

            const messages = await this.messageService.findAllScoped(options);

            return successResponse(
                1,
                "Retrieve messages successfully!",
                devicename,
                messages
            );
        } catch (error) {
            console.log("error----------", error);

            const errMessage = typeof error == "string" ? error : error.message;
            return serverError(0, m.internalServerError, errMessage);
        }
    };

    updateConversation = async (req) => {
        try {
            const { devicename, userDetails: { userId } } = req.headers;
            const { conversationId } = req.params;
            const { title } = req.body;

            if (isEmpty(conversationId)) {
                return badRequest("Conversation id is required");
            }

            const conversation = await this.conversationService.updateOne(
                {
                    _id: conversationId,
                    user_fk: userId,
                    is_Deleted: { $ne: true }
                },
                {
                    title: title
                }
            );

            if (isEmpty(conversation)) {
                return notFound(0, "Conversation not found");
            }

            return successResponse(
                1,
                "Conversation updated successfully!",
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
