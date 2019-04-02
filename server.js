var express = require("express");
var mongoose = require("mongoose");


// Require all models
// var db = require("./models");

var PORT = process.env.PORT || 3000

// Initialize Express
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use("/public", express.static(__dirname + "/public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/note-taker";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Importing routes and allowing server to access
const routes = require("./routes/apiroutes.js")
app.use(routes)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
