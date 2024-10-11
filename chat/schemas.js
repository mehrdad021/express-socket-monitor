const  {Schema} = require("mongoose");
const BaseSchema = require('../bin/BaseSchema')





const BlogSchema = new BaseSchema({
    title: {
        type: String,
        trim: true,
        minLength: 3,
        required: true,
        maxLength: 300,
    },
    english: {
        type: String,
        required: false,
        default: null
    },
    desc_blog: {
        type: String,
        required: true,
    },
    desc_mini: {
        type: String,
        trim: true,
        // minLength: 10,
        // maxLength: 500,
    },
    img: {
        type: String,

    },
    videoUrl: {
        type: String,
        required: false,
    },
    isTopic: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: Schema.ObjectId,
        ref: 'CourseTag'
    }],
    cat: {
        type: Schema.ObjectId,
        ref: 'CourseCat'
    },
    //  BlogTag BlogCat
    publishAt: {
        type: Date,
        default: null
    },
    clientCreateAt: {
        type: Date,
        default: null
    },
    serverCreateAt: {
        type: Date,
        default: null
    },
    // keywords: {
    //     type: String,
    //     trim: true,
    // },
    // keywordsDescription: {
    //     type: String,
    //     trim: true,
    // },
})



module.exports = {blogSchema:BlogSchema.getSchema()}

BlogSchema.setRequire()