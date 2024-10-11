const {blogSchema} = require("./schemas");

// BLOG
blogSchema.statics.getAllBlogs = function (req, limit=10) {
    // return this.find({
    // }).populate("owner").sort('-createdAt').paginate({}, {limit: 2})
    const page = +req.query.page || 1
    const options = {
        page, limit, sort: {createdAt: -1},
        $or:[
            {isTopic: {$exists: false},},
            {isTopic: null},
            {isTopic: false},
        ]
    };
    //
    return this.paginate({}, options)
};
blogSchema.statics.getActiveBlogs = function (req) {
    let now = Date.now()
    return this.find({
        status: 'PUBLISH',
        visible: 'PUBLIC',
        $or: [
            {publishAt: {$exists: false},},
            {publishAt: null},
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $or:[
            {isTopic: {$exists: false},},
            {isTopic: null},
            {isTopic: false},
        ]
    }).sort('-createdAt')
};

blogSchema.statics.getActiveTopics = function (req, limit=20) {
    let now = Date.now()
    return this.find({
        status: 'PUBLISH',
        visible: 'PUBLIC',
        $or: [
            {publishAt: {$exists: false},},
            {publishAt: null},
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $and:[
            {isTopic: {$exists: true},
                // $ne: null
            },
            {isTopic: true},
        ]
    }).sort('-createdAt').limit(limit)
};

blogSchema.statics.findBasePaginate = function (req,limit=10) {
    const page = +req.query.page || 1
    const query = { }
    const options = {
        page, limit,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)

//

};


blogSchema.statics.findBlogPaginate = function (req) {
    const page = +req.query.page || 1
    let now = Date.now()
    const query = {
        $or: [
            {
                publishAt: {$exists: false},

            },
            {
                publishAt: null

            },
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $or:[
            {isTopic: {$exists: false},},
            {isTopic: null},
            {isTopic: false},
        ]
    }

    const options = {
        page, limit: 5,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)

//

};
blogSchema.statics.findTopicPaginate = function (req) {
    const page = +req.query.page || 1
    let now = Date.now()
    const query = {
        $or: [
            {
                publishAt: {$exists: false},

            },
            {
                publishAt: null

            },
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $and:[
            {isTopic: {$exists: true},
                // $ne: null
            },
            {isTopic: true},
        ]
    }

    const options = {
        page, limit: 5,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)

//

};



blogSchema.statics.findBlogPaginateWithTagId = function (req) {
    // return this.finds({tagsId:req.params.id})
    const page = +req.query.page || 1
    let now = Date.now()
    const query = {
        tags: {$exists: true, $ne: []},
        tags: req.params.id,

        $or: [
            {
                publishAt: {$exists: false},

            },
            {
                publishAt: null

            },
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $or:[
            {isTopic: {$exists: false},},
            {isTopic: null},
            {isTopic: false},
        ]


    }

    const options = {
        page, limit: 5,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)

//

};
blogSchema.statics.findBlogPaginateWithCatId = function (req) {
    // return this.finds({tagsId:req.params.id})
    const page = +req.query.page || 1
    let now = Date.now()
    const query = {
        cat: {$exists: true, $nin: null},
        cat: req.params.id,
        $or: [
            {
                publishAt: {$exists: false},

            },
            {
                publishAt: null

            },
            {
                publishAt: {$exists: true, $lte: now}

            }
        ],
        $or:[
            {isTopic: {$exists: false},},
            {isTopic: null},
            {isTopic: false},
        ]


    }

    const options = {
        page, limit: 5,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)

//

};


blogSchema.statics.getBlogById = function (req) {
    return this.findById(req.params.id)

        .populate({
            path: 'comments',
            options: {
                limit: 10,
                sort: {createdAt: -1},

            },
        })
};
blogSchema.statics.getBlogsCount = function (req) {
    return this.getActiveBlogs(req).countDocuments()
};
blogSchema.statics.getBlogCommentCount = function (req) {
    return this.findById(req.params.id).populate('comments').countDocuments()

};
blogSchema.statics.blogUser = function (req) {
    return this.findOne({_id: req.params.id, owner: req.user.id});
};
blogSchema.statics.blogValidation = function (body) {
    // return this.find({ name: new RegExp(name, 'i') });
    return fv.validate(body, schemaValidate)
};
blogSchema.statics.findUserBlogPaginate = function (req) {

    const page = +req.query.page || 1
    let now = Date.now()
    const query = {
        owner: req.user.id,
        $or: [
            {
                publishAt: {$exists: false},

            },
            {
                publishAt: null

            },
            {
                publishAt: {$exists: true, $lte: now}

            }
        ]
    }

    const options = {
        page, limit: 5,
        populate: [

            {
                path: 'cat'
            },
            {
                path: 'tags'
            }
        ], sort: {createdAt: -1},


    };
    return this.paginate(query, options)
};
blogSchema.statics.userBlogsCount = function (req) {
    return this.find({owner: req.user.id}).countDocuments()
};
// BLOG

blogSchema.statics.findSimilar = function (req, catId) {
    let getSimilarBlog = {}
    if (catId) {
        getSimilarBlog = this.getActiveBlogs(req).find({
            cat: catId,
            _id: { "$nin": req.params.id }
        })
    }
    return getSimilarBlog

};