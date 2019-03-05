var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String
  },

  link: {
    type: String
  },
  description: {
    type: String
  },
  //   saved: {
  //     type: Boolean,
  //     default: false
  //   },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
