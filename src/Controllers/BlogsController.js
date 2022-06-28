const mongoose=require("mongoose")
const AuthorModel = require("../Models/AuthorModel")
const BlogsModel=require("../Models/BlogsModel")
const jwt=require("jsonwebtoken")

//Q1 Creating Blog

const blogs=async function(req,res){
    try{
        let data=req.body
        if(Object.keys(data).length===0){
            return res.status(400).send({status:true,msg:"body couldnot be empty"})
         }
        if(!data.title){
            return res.status(400).send({status: false,msg:"title couldnot be empty"})
         }
         if(typeof data.title!="string"){
             return res.status(400).send({status: false,msg:"title must  be string"})
         }
         let title=data.title.trim()
         if(title.length===0){
             return res.status(400).send({status: false,msg:" please enter title name"})
         }
          if(!data.body){
             return res.status(400).send({status: false ,msg: "Body name must  be present"})
          }
          if(typeof data.body!="string"){
             return res.status(400).send({status: false,msg:"Body must  be string"})
         }
         let Body=data.body.trim()
         if(Body.length===0){
             return res.status(400).send({status: false,msg:" please enter Body name"})
         }
         let Tags=data.tags
         console.log(Tags)
     if(!Tags){
        return res.status(400).send({status: false,msg: "tags must be present"})
     }
     if(typeof Tags!="object"){
        return res.status(400).send({status: false,msg: "tags must be in array of strings"})
     }
     let subcategory=data.subcategory
     if(!subcategory){
     return res.status(400).send({status: false,msg: "subcatogery must be present"})
     }
     if(typeof subcategory!="object"){
     return res.status(400).send({status: false,msg: "subcatogery must be in array of strings"})
     }
     let author_id=data.authorId

if(!author_id){
    return res.status(400).send({status:false,msg: "Authorid must be present"})
}
if(!mongoose.isValidObjectId(author_id)){
    return res.status(400).send({status:false,msg:"Invalid AuthorId"})
}
let author=await AuthorModel.findById(author_id)
if(!author){
  return  res.status(404).send({status:false,msg:"user not exist"})
}
    const CreateBlog=await BlogsModel.create(data)
    return res.status(201).send({status:true,data:CreateBlog})
}
catch(err){
   res.status(500).send({status:false,error:err.message})
}}

//Q getblogs

const getblogs=async function(req,res){
    try{
       let query=req.query
       
if(query.authorId){
       if(!mongoose.isValidObjectId(query.authorId)){
        return res.status(400).send({status:false,msg:"Invalid AuthorId"})
    }}
        const getblogs=await BlogsModel.find({$and:[{isDeleted:false,isPublished:true}, query]})
        if(getblogs.length===0){
            return res.status(404).send({status:false,msg:"No User Found"})
        }
        res.status(200).send({status:true,data:getblogs})
        }
        catch(err){
            res.status(500).send({status:false,error:err.message})
        }
}

//Update Qeustion

const UpdateBlog=async function(req,res){
    try{
    let data=req.body
    let tags=data.tags
    let subcategory=data.subcategory
    let BlogId=req.params.blogsid
    const UpdateBlog=await BlogsModel.findOneAndUpdate({_id:BlogId},{$set:{isPublished:true,publishedAt:Date.now(),isDeleted:data.isDeleted, body:data.body,title:data.title},$push:{tags,subcategory}},{new:true})
    res.status(200).send({status: true,data:UpdateBlog})
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}
}


//DeletedBlog Question

const DeletedBlog=async function(req,res){
    try{
    let BlogsId=req.params.blogsid

    const DeletedBlog=await BlogsModel.findOneAndUpdate({_id:BlogsId,isDeleted:false},{$set:{isDeleted:true,deleteAt:Date.now()}})
    return res.status(200).send({status:true,msg: DeletedBlog})
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}
}
// Deleted Query

const DeletedQuery=async function(req,res){
    try{
        const query= req.query
    if(Object.keys(query).length===0){
        return res.status(400).send({status:false,msg:"query params couldnot be empty"})
    }
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "Functionup-radon")
    let authorid=decodedToken.authorid
    console.log(authorid)
if(!query){
    return res.status(400).send({status: false,msg:"query params couldnot be empty"})
}
const blogs=await BlogsModel.find({$and:[{isDeleted:false}, query]})
console.log(blogs)
if(Array.isArray(blogs)&&blogs.length===0){
     return res.status(404).send({status:false,msg:"no matching blog found"})
}
const idsOfBlogsDelet=blogs.map(blog=>{
    if(blog.authorId.toString()===authorid) return blog._id
})
    const DeletedQuery=await BlogsModel.updateMany({_id:{$in: idsOfBlogsDelet}},{$set:{isDeleted:true,deletedAt:new Date()}}) 
    return res.status(200).send({status: true,msg:DeletedQuery})
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}}



module.exports.blogs=blogs

module.exports.getblogs=getblogs

module.exports.UpdateBlog=UpdateBlog

module.exports.DeletedBlog=DeletedBlog

module.exports.DeletedQuery=DeletedQuery

