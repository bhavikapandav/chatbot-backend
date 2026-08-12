// utils/apiFeatures.js
class APIFeatures {
    constructor(query, queryString, searchableFields = []) {
        this.query = query;
        this.queryString = queryString;
        this.searchableFields = searchableFields; // e.g. ['name', 'description', 'tags']
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search() {
        if (this.queryString.search && this.searchableFields.length > 0) {
            const searchRegex = new RegExp(this.queryString.search, 'i');
            this.query = this.query.find({
                $or: this.searchableFields.map(field => ({ [field]: searchRegex }))
            });
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            this.query = this.query.select(this.queryString.fields.split(',').join(' '));
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 10;
        this.query = this.query.skip((page - 1) * limit).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;