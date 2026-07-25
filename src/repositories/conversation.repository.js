const { Conversation } = require("../models")
const { commonUtils: { fetchRecords } } = require("../utils")
class conversationRepository {
    findOne = async (options) => {
        return await Conversation.findOne(options);
    };
    findById = async (id) => {
        return await Conversation.findById(id);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await Conversation.create(requestPayload);
    };
    updateOne = async (where, updatePayload) => {
        return await Conversation.findOneAndUpdate(
            where,
            updatePayload,
            { returnDocument: "after" }
        );
    };
    softDelete = async (where) => {
        return await Conversation.findOneAndUpdate(
            where,
            { is_Deleted: true },
            { returnDocument: "after" }
        );
    };
    findAll = async (options = {}, unscoped = false) => {
        const { currentPage, pageSize, is_paginate, ...restOptions } = options;

        return await fetchRecords(
            Conversation,
            { ...restOptions, currentPage, pageSize },
            !!is_paginate,
            unscoped
        );
    };
}
module.exports = new conversationRepository;
