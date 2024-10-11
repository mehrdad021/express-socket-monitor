const {blogSchema} = require("./schemas");
const { loggger} = require("../utils/util");
const {readCalculate} = require("../bin/template-tags");


// blogSchema.methods.gau = function () {
//
//     return `/blog/${this.id}`
// }

blogSchema.methods.gau = function () {

    if(this.isTopic){
        return `/forums/topics/${this.id}/${this.getSlug}`
    }

    return `/${this.collection.name}/${this.id}/${this.getSlug}`
}

blogSchema.methods.gauEdit = function (req) {

    // return `admin/${this.collection.name}/edit/${this.id}`
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

blogSchema.methods.truncateTitle50 = function () {
    let srt = this.title
    let len = 50
    if (srt && srt.length > len && srt.length > 0) {
        let newStr = srt + " "
        newStr = srt.substring(0, len)
        newStr = srt.substring(0, newStr.lastIndexOf(" "))
        newStr = newStr.length > 0 ? newStr : srt.substring(0, len)

        return newStr + " ..."
    }
    return srt+ " ..."
}

blogSchema.methods.slogan = function () {

    if (this.title && this.english && this.english === this.title)
        return ` ${this.title}`
    return ` ${this.title} - ${this.english}`
}
blogSchema.methods.siteLink = function () {

    return `https://uroad/blog/${this.id}`
}

blogSchema.methods.getViewCount = function () {

    let viewCount = []
    if(this.virtualViewCount && this.virtualViewCount.length>0){
        this.virtualViewCount.forEach(item=>{
            viewCount.push(item)
        })
    }
    return viewCount
}
blogSchema.methods.getNumberViewCount = function () {

    let count = 0
    if(this.getViewCount() && this.getViewCount().length >0){
        this.getViewCount().forEach(item=>{
            if(item) count+=1
        })
    }
    return count
}

blogSchema.methods.getTitle = function () {
    return `${this.title}`
}

blogSchema.methods.getVideoUrl = function () {
    return this.videoUrl
}
blogSchema.methods.readTime = function () {

    try {

        if(this.desc_blog){
            // const wordsLength = this.desc_blog.toString().trim().length;
            const wordsLength = this.desc_blog.toString().trim().split(/\s+/).length;

            return readCalculate(wordsLength)
        }else return 0

    }
    catch (e) {
        loggger(e)
        return 0
    }

}
// blogSchema.methods.getImg = function () {
// }
