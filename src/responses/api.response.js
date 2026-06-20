class Reply {
    constructor(status, responseCode, success, message, data = null, err = null) {
        this.status = status;
        this.responseCode = responseCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.err = err;
    }
}

module.exports = {
    successResponse: (code, message, devicename, data) => {
        return new Reply(
            200,
            code,
            true,
            message,
            data)
    },
    badRequest: (message = "Bad message") => {
        return new Reply(400, 0, false, message);
    },
    notFound: (code, message, err) => {
        return new Reply(404, code, false, message, null, err);
    },
    validationError: (code, message, err) => {
        return new Reply(422, code, false, message, null, err);
    },
    serverError: (code, message, err) => {
        return new Reply(500, code, false, message, null, err);
    },
    failConflict: (code, message, err) => {
        return new Reply(409, code, false, message, null, err);
    },
    forbidden: (code, message, err) => {
        return new Reply(403, code, false, message, null, err);
    },
    requestTimeOut: (code, message, err) => {
        return new Reply(408, code, false, message, null, err);
    },
    failAuthorization: (code, message, err) => {
        return new Reply(401, code, false, message, null, err);
    },
}