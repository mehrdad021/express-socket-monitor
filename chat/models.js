const mongoose = require("mongoose");
const {blogSchema} = require('./schemas')
// const BaseSchema = require("../bin/BaseSchema");
// const {loggger} = require("../utils/util");
// loggger(__dirname)
// require('./virtuals')
// require('./signals')
// require('./methods')
// require('./managers')

// blogSchema



const BlogModel = mongoose.model("Blog", blogSchema)

module.exports = {BlogModel}