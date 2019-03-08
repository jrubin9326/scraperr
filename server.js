//required packages
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
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

    $("article").each(function(i, element) {
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
          console.log("HELLO");
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
app.get("/saved", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/saved.html"));
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
