const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const articleSchema={
  title:String,
  content:String
};

const Article = mongoose.model('Article', articleSchema);


app.route("/articles")

.get(function (req , res) {
  Article.find( function (err , foundArticles) {
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

 .post(function (req,res) {
  const newarticle= new Article({
    title:req.body.title,
    content:req.body.content
  });
  newarticle.save(function(err){
    if(!err){
      res.send("added seccesfuly!");
    } else {
      res.send(err);
    }
  })
})

 .delete(function (req,res) {
  Article.deleteMany( function (err) {
    if(!err){
      res.send("delete seccesfuly!");
    } else {
      res.send(err);
    }
  });
});


app.route("/articles/:articleTitle")

.get(function(req ,res){
  Article.findOne({title:req.params.articleTitle},function (err , foundArticle) {
    if(foundArticle){
    res.send(foundArticle);
  } else {
    res.send("not found article with this title");
  }

  });
})

.put(function (req,res) {
  Article.replaceOne({title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},

   function (err , info) {
     if(!err){
       res.send("updeate article seccesfuly "+ info.nModified);
     } else {
       res.send("faild to update "+err);
     }
   });
})

.patch(function (req,res) {
  Article.updateOne({title:req.params.articleTitle},
     req.body,
   function (err) {
     if(!err){
       res.send("updeate article seccesfuly!");
     } else {
       res.send(err);
     }
   });
})

.delete(function (req,res) {
  Article.deleteOne({title:req.params.articleTitle},
   function (err) {
     if(!err){
       res.send("deleted article seccesfuly!");
     } else {
       res.send(err);
     }
   });
});

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
