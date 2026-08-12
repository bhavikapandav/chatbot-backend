const { ConversationRepository } = require("../../repositories")
class ConversationService {
    findOne = async (options) => {
        return await ConversationRepository.findOne(options);
    }
    findById = async (id) => {
        return await ConversationRepository.findById(id);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);

        return await ConversationRepository.create(requestData);
    };
    updateOne = async (where, requestData) => {
        return await ConversationRepository.updateOne(where, requestData);
    };
    softDelete = async (where) => {
        return await ConversationRepository.softDelete(where);
    };
    findAllWithoutScope = async (options = {}) => {
        return await ConversationRepository.findAll(options, true); // includes soft-deleted
    };

    findAllScoped = async (options = {}) => {
        return await ConversationRepository.findAll(options, false); // default, excludes soft-deleted
    };

}
module.exports = ConversationService;
