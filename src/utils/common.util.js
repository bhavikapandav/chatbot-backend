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
const fetchRecords = async (
    model,
    options = {},
    paginate = false,
    unscoped = false
) => {
    let currentPage = 1,
        pageSize = 10;

    const {
        where = {},
        sort = {},
        select = null,
        populate = null,
        ...rest
    } = options;

    let query = model.find(where);

    if (unscoped) query = query.withDeleted(); // <-- the trick in action
    if (sort && Object.keys(sort).length) query = query.sort(sort);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);

    if (paginate === true) {
        currentPage = parseInt(rest.currentPage) || 1;
        pageSize = parseInt(rest.pageSize) || 10;

        const skip = (currentPage - 1) * pageSize;
        query = query.skip(skip).limit(pageSize);

        let countQuery = model.countDocuments(where);
        if (unscoped) countQuery = countQuery.setOptions({ skipSoftDelete: true });

        const [rows, count] = await Promise.all([query, countQuery]);
        const totalPages = Math.ceil(count / pageSize);

        return {
            totalItems: count,
            totalPages,
            currentPage,
            hasPrevious: currentPage > 1,
            hasNext: currentPage < totalPages,
            previous: currentPage > 1 ? currentPage - 1 : null,
            next: currentPage < totalPages ? currentPage + 1 : null,
            rows,
        };
    }

    return await query;
};
// ---------- Filter clause builder ----------
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getFilterClause = (filterData) => {
    const { fields, search, options = {} } = filterData;
    const [firstName, lastName] = search.trim().split(" ");

    if (fields.includes("userName") && firstName && lastName) {
        return {
            $and: [
                {
                    [options.first_name]: {
                        $regex: escapeRegex(firstName),
                        $options: "i",
                    },
                },
                {
                    [options.last_name]: {
                        $regex: escapeRegex(lastName),
                        $options: "i",
                    },
                },
            ],
        };
    }

    return {
        $or: fields.flatMap((field) => {
            if (field === "userName") {
                return [
                    {
                        [options.first_name]: {
                            $regex: escapeRegex(firstName || search),
                            $options: "i",
                        },
                    },
                    {
                        [options.last_name]: {
                            $regex: escapeRegex(lastName || search),
                            $options: "i",
                        },
                    },
                ];
            }
            return {
                [field]: { $regex: escapeRegex(search), $options: "i" },
            };
        }),
    };
};

module.exports = {
    isEmpty,
    generateSlug,
    fetchRecords,
    getFilterClause
}