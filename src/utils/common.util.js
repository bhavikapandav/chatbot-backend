const slugify = require("slugify");

const isEmpty = (value) => {
    if (value === undefined || value === null) return true;

    if (typeof value === "string") {
        return ["", "null", "undefine", "0", "NaN"].includes(value.trim());
    }
    if (Array.isArray(value) || typeof value === "object") {
        return Object.keys(value).length === 0;
    }
}

const generateSlug = (value) => {
    return slugify(value, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        trim: true,
    })
}
module.exports = {
    isEmpty,
    generateSlug
}