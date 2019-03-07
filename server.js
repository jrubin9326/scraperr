//required packages
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

//required models

const db = require("./models");

const PORT = process.env.PORT || 3000;

//initalize express

const app = express();

//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadline";
//connect to mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// routes
app.get("/scrape", (req, res) => {
  axios.get("https://www.theatlantic.com/most-popular/").then(response => {
    let $ = cheerio.load(response.data);

    $("li.article blog-article").each(function(i, element) {
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h2")
        .text();
      result.link = $(this)
        .children("h2")
        .children("a")
        .attr("href");
      result.description = $(this)
        .children("p")
        .text();
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        // View the added result in the console

        .catch(err => console.log(`${err}`));
    });
  });

  res.send(`Send Complete`);
});

// Route for getting all Articles from the db
app.get("/articles", (req, res) => {
  //   Grab every document in the Articles collection

  db.Article.find(req.title)
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(err => res.json(err));
});

// // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
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

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
