import mongoose from "mongoose";

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title : String,
    body : String,
    numOfLikes : Number
});

const Article = mongoose.model("Article" , articleSchema);

export default Article;