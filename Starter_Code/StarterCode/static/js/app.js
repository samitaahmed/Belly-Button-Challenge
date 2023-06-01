d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function(data) {
    // Use the data here
    console.log(data);
  })
  .catch(function(error) {
    // Handle any errors that occur during the request
    console.log("Error loading the JSON file:", error);
  });
