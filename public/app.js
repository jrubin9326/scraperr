$.getJSON("/articles", function(data) {
  //display articles dynamically under article div
  for (var i = 283; i < data.length; i++) {
    $("#articles").append(
      "<hr><p class ='art' data-id='" +
        data[i]._id +
        "'>" +
        "<a href = 'https://www.theatlantic.com" +
        data[i].link +
        "'>" +
        "<span class = 'title' >" +
        data[i].title +
        "</span> </a> <br />" +
        data[i].description +
        "<button class = 'btn btn-info' type = 'submit'>SAVE</button> </p>"
    );
  }
});
//save note
$(document).on("click", ".btn-info", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $(".title").val()
      // Value taken from note textarea
      //   body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $(".title").val("");
  //   $("#bodyinput").val("");
});
