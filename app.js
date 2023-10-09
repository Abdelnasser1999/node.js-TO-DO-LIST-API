import express from "express";
import mongoose from "mongoose";
import Article from "./models/Article.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://nasser:Nasser99@cluster0.bjubmex.mongodb.net/?retryWrites=true&w=majority")
.then(() =>{
    console.log("connected to database success");
}).catch((error) =>{
    console.log("error in connectint to DB : " , error);
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const users = [];
// get

app.get("/", (req,res) =>{
    res.json({
        status : 404,
       result : "Hello from home"
    });
});

// respond with html file
app.get("/htmlresponse", (req,res) =>{
    res.sendFile( __dirname + "/views/hello.html");
});

// respond with ejs file -- dynamic html
app.get("/ejslresponse", (req,res) =>{
    res.render( "hello.ejs" , {
        name : "ahmad"
    });
});


app.get("/users", (req,res) =>{
    if(users.length == 0 ){
        res.json({
            status : 404,
            result : "no users found!!"
         });
     
        // res.status(404).send("no users found!!");
        return;
    }
    res.json({
        status : 200,
        result : users
     });

    // res.status(200).send(users);
});
  
// post by body
app.post("/create-users" , (req,res) => {
    const user = req.body;
    const userfound= users.find((x) => x.id === user.id);
    if(userfound){
        res.json({
            status : 400,
            result : "user already exists!!"
         });
        return;
    }
    users.push(req.body)
    console.log(req.body);
    res.json({
        status : 201,
        result : "Created"
     });

    // res.status(201).send("Created!");
})

// post by path params
app.post("/create-users2/:id/:name/:age" , (req,res) => {
    let id = req.params.id;
    let name = req.params.name;
    let age = req.params.age;
    const user = {id,name,age};
    const userfound= users.find((x) => x.id === user.id);
    if(userfound){
        
        res.status(400).send("user already exists");
        return;
    }
    users.push(user)
    console.log(user);
    res.status(201).send("Created!");
})
// post by query params
app.post("/create-users3" , (req,res) => {
    let id = req.query.id;
    let name = req.query.name;
    let age = req.query.age;
    const user = {id,name,age};
    const userfound= users.find((x) => x.id === user.id);
    if(userfound){
        res.status(400).send("user already exists");
        return;
    }
    users.push(user)
    console.log(user);
    res.status(201).send("Created!");
})
 

// delete
app.delete("/delete-user/:id" , (req,res) =>{
    const {id} = req.params;
    const userFoundIndex = users.findIndex((x) => x.id == id);
    if(userFoundIndex==-1){
        res.status(400).send("user not found");
        return;
    }
    users.splice(userFoundIndex , 1);
    res.status(200).send("user deleted successfully");
});


// =========== ARTICLES ENDPOINTS ================

app.post("/CreateArticle" , async (req , res) =>{
    const newArticle = new Article();
    newArticle.title = req.body.title;
    newArticle.body = req.body.body;
    newArticle.numOfLikes = req.body.numOfLikes;
    await newArticle.save();
    console.log(req.body);
    res.json({
        status : 201,
        result : "Created"
     });
});
app.get("/GetArticle" , async (req , res) =>{
    const articles = await Article.find();
    res.json({
        status : 201,
        articles : articles
     });
});
app.get("/GetArticleById" , async (req , res) =>{
    try{
            const article = await Article.findById(req.query.id);
    res.json({
        status : 201,
        articles : article
     });

    }catch{
        res.json({
            status : 500,
            articles : "error"
         });
    
    }
});
app.delete("/DeleteArticle" , async (req , res) =>{
    try{
    const article = await Article.findByIdAndDelete(req.query.id);
    res.json({
        status : 201,
        articles : article
     });

    }catch{
        res.json({
            status : 500,
            articles : "error"
         });
    
    }
});

app.get("/ShowAllArticles" , async (req , res) =>{
    const articles = await Article.find();
    res.render( "allArticles.ejs" , {
        articles : articles
    });
});

// listner
app.listen(3000,() =>{
    console.log("Server started on port 3000 ");
});  