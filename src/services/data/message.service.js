const { MessageRepository } = require("../../repositories")
class ConversationService {
    findOne = async (options) => {
        return await MessageRepository.findOne(options);
    }
    findById = async (id) => {
        return await MessageRepository.findById(id);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);

        return await MessageRepository.create(requestData);
    };
    updateOne = async (where, requestData) => {
        return await MessageRepository.updateOne(where, requestData);
    };
    softDelete = async (where) => {
        return await MessageRepository.softDelete(where);
    };
    findAllWithoutScope = async (options = {}) => {
        return await MessageRepository.findAll(options, true); // includes soft-deleted
    };

    findAllScoped = async (options = {}) => {
        return await MessageRepository.findAll(options, false); // default, excludes soft-deleted
    };

}
module.exports = ConversationService;
