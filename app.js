const express = require("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
app = express();

//mongoose.connect("mongodb://localhost:3000/bug_tracker_app", {useNewUrlParser: true,
  //  useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://abisai:ARIEM1211@cluster0.7f0ec.mongodb.net/BTA?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
  

// APP Config

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var bugSchema = new mongoose.Schema({
    title: String,
    project: String,
    area: String,
    priority: String,
    comment: String,
    created: {type: Date, default: Date.now}
});

var Bug = mongoose.model("Bug", bugSchema);

// RESTful ROUTES
app.get("/", function(req, res){
    res.redirect("/bugs");
});

// INDEX ROUTE
app.get("/bugs", function(req, res){
    Bug.find({}, function(err, bugs){
        if(err){
            console.log(err);
        }
        else {
            res.render("index", {bugs: bugs});
        }
    });
});

// NEW ROUTE
app.get("/bugs/new", function(re, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/bugs", function(req, res){
    
    req.body.bug.comment = req.sanitize(req.body.bug.comment);
    // Create a new Bug and save to DB
    Bug.create(req.body.bug, function(err, newBug){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to bugs page
            res.redirect("/bugs");
        }
    });
});

// SHOW ROUTE
app.get("/bugs/:id", function(req, res){
    Bug.findById(req.params.id, function(err, foundBug){
        if(err){
            res.redirect("/bugs");
        }
        else{
            res.render("show", {bug: foundBug});
        }
    });

});

// EDIT ROUTE
app.get("/bugs/:id/edit", function(req, res){
    Bug.findById(req.params.id, function(err, foundBug){
        if(err){
            res.redirect("/bugs");
        }
        else{
            res.render("edit", {bug: foundBug});
        }
    });
});

// UPDATE ROUTE
app.put("/bugs/:id", function(req, res){
    req.body.bug.body = req.sanitize(req.body.bug.body);
    Bug.findByIdAndUpdate(req.params.id, req.body.bug, function(err, updatedBug){
        if(err){
            res.redirect("/bugs");
        }
        else{
            res.redirect("/bugs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/bugs/:id", function(req, res){
    //destroy bug
    Bug.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/bugs");
        }
        else{
            res.redirect("/bugs");
        }
    });
});

const port = process.env.PORT || 21707;
app.listen(port, () => {
console.log("Server is Running");
})

    