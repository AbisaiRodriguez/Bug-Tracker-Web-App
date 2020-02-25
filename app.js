const express = require("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
app = express();

// APP Config
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
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
    
    req.body.bug.comments = req.sanitize(req.body.bug.comments);
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


app.listen(3000, () => {
    console.log("Server is Running");
});
    