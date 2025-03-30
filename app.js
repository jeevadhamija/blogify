const express=require('express');
const app=express();;
const blogRouter=require("./routes/blog");
const {checkForAuth}=require("./middleware/auth");
const mongoose=require("mongoose");
const cookieparser=require("cookie-parser");
const add='mongodb://127.0.0.1:27017/blogify'
mongoose.connect(process.env.MONGO_URL||add).then(()=>{
    console.log("mongodb is connected");
})
const Blog=require("./models/blogs");
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
const path=require("path");
const Userrouter=require("./routes/user");
const PORT=process.env.PORT||1000;
app.set('view engine','ejs');
app.set("views",path.resolve('./views'));
app.use(checkForAuth("token"));
app.use(express.static(path.resolve("./upload")));
app.get('/',async (req,res)=>{
    const allblogs=await Blog.find({});
    return res.render('home',{
        user:req.user,
        blogs:allblogs,
    });
})
app.use("/user",Userrouter);
app.use("/blog",blogRouter);
app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})