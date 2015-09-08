/**
 * Copyright 2015, Fabian Buentello, All rights reserved.
 */

// Load the Visualization API and the piechart package.
google.load('visualization', '1', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

	$.get("../../Progress/technicalProgress.json", function(jsonData, status){

		// Create the data table.
		var dataTb = new google.visualization.DataTable(jsonData);

		// Set chart options
		var options = {
			pointSize: 20,
			titlePosition: 'none',
			title:'Progress of Vincent',
			tooltip: {isHtml: true},
			hAxis: {
			  title: 'Date (M/D/Y)'
			},
			vAxis: {
			  title: 'Accuracy (%)'
			},
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
		chart.draw(dataTb, options);
	});
}