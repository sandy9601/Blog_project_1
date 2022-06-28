const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: 'Blog title is required',
            trim :true
        },
        body: {
            type: String,
            require: 'Blog body is required',
            trim :true
        },
        authorId:{
            type: ObjectId,
            refs: "AuthorModel",
            require: 'Blog Author is required'
        },
        tags:[{
            type: String,
            trim: true
        }],
        category: {
            type: String,
            require:'Blog Category is required',
            trim: true
        },
        subcategory: [{
            type: String,
            trim: true
        }],
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deleteAt: {
            type: Date,
            default:null
        },

    },
    { timetamps: true }
);


module.exports = mongoose.model("BlogsModel", BlogsSchema)



