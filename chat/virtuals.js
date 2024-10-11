const {blogSchema} = require("./schemas");


blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blogId',
})

blogSchema.virtual('virtualViewCount', {
    ref: 'ViewCount',
    localField: '_id',
    foreignField: 'blog'
})