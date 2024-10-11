const {blogSchema} = require("./schemas");


blogSchema.pre(['find', 'findOne'], function () {
    this
        .populate({
            path: 'cat',
        })
        .populate({
            path: 'comments',
        })
        .populate({
            path: 'owner',
        })
        .populate({
            path: 'tags',

        })
        .populate({
            path: 'virtualViewCount',

        })


});