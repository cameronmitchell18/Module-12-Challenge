function init() {
	// Grab a reference to the dropdown select element
	var selector = d3.select("#selDataset");

	// Use the list of sample names to populate the select options
	d3.json("samples.json").then((data) => {
		var sampleNames = data.names;

		sampleNames.forEach((sample) => {
			selector.append("option").text(sample).property("value", sample);
		});

		// Use the first sample from the list to build the initial plots
		var firstSample = sampleNames[0];
		buildCharts(firstSample);
		buildMetadata(firstSample);
	});
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
	// Fetch new data each time a new sample is selected
	buildMetadata(newSample);
	buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
	d3.json("samples.json").then((data) => {
		var metadata = data.metadata;
		// Filter the data for the object with the desired sample number
		var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
		var result = resultArray[0];
		// Use d3 to select the panel with id of `#sample-metadata`
		var PANEL = d3.select("#sample-metadata");

		// Use `.html("") to clear any existing metadata
		PANEL.html("");

		// Use `Object.entries` to add each key and value pair to the panel
		// Hint: Inside the loop, you will need to use d3 to append new
		// tags for each key-value in the metadata.
		Object.entries(result).forEach(([key, value]) => {
			PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
		});
	});
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
	// 2. Use d3.json to load and retrieve the samples.json file
	d3.json("samples.json").then((data) => {
		var samples = data.samples;

		// Create a variable that filters the samples for the object with the desired sample number.

		var sampleArray = samples.filter(
			(sampleObject) => sampleObject.id == sample
		);

		// 1. Create a variable that filters the metadata array for the object with the desired sample number.

		var metadata = data.metadata;

		var metaArr = metadata.filter((sampleObject) => sampleObject.id == sample);

		// Create a variable that holds the first sample in the array.

		var result = sampleArray[0];

		// 2. Create a variable that holds the first sample in the metadata array.

		var resultOne = metaArr[0];

		// Create variables that hold the otu_ids, otu_labels, and sample_values.

		var otu_ids = result.otu_ids;

		var otu_labels = result.otu_labels;

		var sample_values = result.sample_values;

		console.log(otu_ids);
		console.log(otu_labels);
		console.log(sample_values);

		// 3. Create a variable that holds the washing frequency.

		var washing = parseFloat(resultOne.wfreq);

		console.log(washing);

		// Create the yticks for the bar chart.

		var yticks = otu_ids
			.slice(0, 10)
			.map((id) => `OTU ${id}`)
			.reverse();

		// 8. Create the trace for the bar chart.
		var barData = [
			{
				x: sample_values.slice(0, 10).reverse(),
				y: yticks,
				text: otu_labels.slice(0, 10).reverse(),
				type: "bar",
				orientation: "h",
			},
		];
		// 9. Create the layout for the bar chart.
		var barLayout = {
			title: "Top 10 Bacterial Species",
			xaxis: { title: "Sample Values" },
			yaxis: { title: "ID's" },
		};
		// 10. Use Plotly to plot the data with the layout.

		Plotly.newPlot("bar", barData, barLayout);

		// 1. Create the trace for the bubble chart.
		var bubbleData = [
			{
				x: otu_ids.slice(0, 10).reverse(),
				y: sample_values.slice(0, 10).reverse(),
				text: otu_labels.slice(0, 10).reverse(),
				mode: "markers",
				marker: {
					size: sample_values.slice(0, 10).reverse(),
					color: otu_ids.slice(0, 10).reverse(),
					colorscale: "Earth",
				},
			},
		];

		// 2. Create the layout for the bubble chart.
		var bubbleLayout = {
			title: "Top 10 Bacterial Species",
			xaxis: { title: "Sample Values" },
			yaxis: { title: "ID's" },
		};

		// 3. Use Plotly to plot the data with the layout.
		Plotly.newPlot("bubble", bubbleData, bubbleLayout);

		// 4. Create the trace for the gauge chart.
		var gaugeData = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: washing,
				title: { text: "Belly Button Washing Frequency" },
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 10], tickwidth: 1 },
					steps: [
						{ range: [0, 2], color: "red" },
						{ range: [2, 4], color: "orange" },
						{ range: [4, 6], color: "yellow" },
						{ range: [6, 8], color: "limegreen" },
						{ range: [8, 10], color: "blue" },
					]
				}
			}
		];

		// 5. Create the layout for the gauge chart.
		var gaugeLayout = {
			width: 700,
			height: 600,
			margin: { t: 10, b: 40, 1:100, r:100 },
		};

		// 6. Use Plotly to plot the gauge data and layout.
		Plotly.newPlot("gauge", gaugeData, gaugeLayout);
	});
}
