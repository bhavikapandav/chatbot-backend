const { Message } = require("../models")
const { commonUtils: { fetchRecords } } = require("../utils")
class MessageRepository {
    findOne = async (options) => {
        return await Message.findOne(options);
    };
    findById = async (id) => {
        return await Message.findById(id);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await Message.create(requestPayload);
    };
    updateOne = async (where, updatePayload) => {
        return await Message.findOneAndUpdate(
            where,
            updatePayload,
            { returnDocument: "after" }
        );
    };
    softDelete = async (where) => {
        return await Message.findOneAndUpdate(
            where,
            { is_Deleted: true },
            { returnDocument: "after" }
        );
    };
    findAll = async (options = {}, unscoped = false) => {
        const { currentPage, pageSize, is_paginate, ...restOptions } = options;

        return await fetchRecords(
            Message,
            { ...restOptions, currentPage, pageSize },
            !!is_paginate,
            unscoped
        );
    };
}
module.exports = new MessageRepository;
