const express = require("express"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
app = express();

// APP Config
app.set("view engine", "ejs");
app.use(express.static("public"));

// RESTful ROUTES
app.get("/", function(req, res){
    res.render("bugs");
});

app.listen(3000, () => {
    console.log("Server is Running");
});
    