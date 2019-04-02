const express = require("express");
const router = express.Router();
var db = require("../models/Index");

const axios = require("axios");
const cheerio = require("cheerio");

// router.get("/", function(req, res) {
//     res.render("index")
// })

router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.clickhole.com/c/news").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    results = []
    $("div.item__content").each(function(i, element) {
      // Save an empty result object
      var result = {};

      
      // // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this)
        .children(".item__text")
        .children(".entry-title")
        .text();
      result.link = $(this)
        .children(".item__text")
        .children(".entry-title")
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children(".item__text")
        .children(".entry-summary")
        .text();
      results.push(result)

      // console.log(result);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.json(results);
  });
});

// Route for getting all Articles from the db
router.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle)
      let articleObj = {
          Articles: dbArticle
      }
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", articleObj);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: {note: dbNote._id} }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/notes/:id", function(req, res) {
  db.Note.findOneAndDelete({_id: req.params.id})
    .then(function(){
      res.send("Deleted note " + req.params.id);
    })
});

router.delete("/articles/:id", function(req, res) {
  db.Article.findOneAndDelete({_id: req.params.id})
    .then(function(deleted) {
      // res.json(deleted)
      const articleNotes = deleted.note;
      // res.json(articleNotes)
      return db.Note.deleteMany({_id: {$in: articleNotes}});
    })
    .then(function(data) {
      res.json(data);
    })
})

module.exports = router;