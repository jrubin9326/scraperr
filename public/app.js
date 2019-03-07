$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 283; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<hr><p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].link +
        "<br/>" +
        data[i].description +
        "<button type = 'submit'>SAVE</button> </p>"
    );
  }
});
