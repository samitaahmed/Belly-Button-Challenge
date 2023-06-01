// Constants for the JSON data URL and dropdown menu
const jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dropdown = d3.select("#selDataset");

// Function to populate the dropdown menu
function populateDropdown(data) {
  // Get the sample names from the data
  const sampleNames = data.names;

  // Add options to the dropdown menu
  dropdown.selectAll("option")
    .data(sampleNames)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });

  // Initial chart rendering
  const initialSample = sampleNames[0];
  buildBarChart(initialSample, data);
  buildBubbleChart(initialSample, data);
}

// Function to display the sample metadata
function displaySampleMetadata(sample, data) {
  // Find the sample metadata based on the selected sample name
  const sampleMetadata = data.metadata.find(function(d) {
    return d.id === parseInt(sample);
  });

  // Clear the existing metadata panel
  const sampleMetadataPanel = d3.select("#sample-metadata");
  sampleMetadataPanel.html("");

  // Append each key-value pair from the metadata to the panel
  Object.entries(sampleMetadata).forEach(function([key, value]) {
    sampleMetadataPanel.append("p").text(`${key}: ${value}`);
  });
}


// Function to build the bar chart
function buildBarChart(sample, data) {
  // Find the sample data based on the selected sample name
  const sampleData = data.samples.find(function(d) {
    return d.id === sample;
  });

  // Get the top 10 OTUs
  const top10SampleValues = sampleData.sample_values.slice(0, 10).reverse();
  const top10OTUIds = sampleData.otu_ids.slice(0, 10).reverse();
  const top10OTULabels = sampleData.otu_labels.slice(0, 10).reverse();

  // Create the horizontal bar chart
  const trace = {
    type: "bar",
    orientation: "h",
    x: top10SampleValues,
    y: top10OTUIds.map(function(id) {
      return `OTU ${id}`;
    }),
    text: top10OTULabels,
    hovertemplate: "%{text}<extra></extra>"
  };

  const layout = {
    title: "Bar Chart"

  };

  const chartData = [trace];
  Plotly.newPlot("bar", chartData, layout);
 
}

// Function to build the bubble chart
function buildBubbleChart(sample, data) {
  // Find the sample data based on the selected sample name
  const sampleData = data.samples.find(function(d) {
    return d.id === sample;
  });

  // Get the data for the bubble chart
  const bubbleData = [{
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: "markers",
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: "Earth"
    }
  }];

  // Define the layout for the bubble chart
  const layout = {
    title: "Bubble Chart",
    xaxis: { title: "OTU ID" },

  };

  // Plot the bubble chart
  Plotly.newPlot("bubble", bubbleData, layout);
}

// Load the JSON data and populate the dropdown menu
d3.json(jsonURL)
  .then(function(data) {
    populateDropdown(data);

    // Event listener for dropdown selection change
    dropdown.on("change", function() {
      const selectedSample = dropdown.property("value");
      buildBarChart(selectedSample, data);
      buildBubbleChart(selectedSample, data);
      displaySampleMetadata(selectedSample, data);
    });

    // Initial display of metadata for the default sample
    const initialSample = dropdown.property("value");
    displaySampleMetadata(initialSample, data);
  })
  .catch(function(error) {
    console.log("Error loading the JSON file:", error);
  });
