google.load('visualization', '1', {
    packages: ['table']
});
var visualization;

// Draw Summary Table
function drawVisualizationSummaryTable() {
    var query = new google.visualization.Query('https://spreadsheets.google.com/tq?key=1CpOU9TKZXwGu4h40TuGeVHI4fw8eMX_bube2AJY4taY&output=html&usp=sharing');
    //query.setQuery('SELECT A, B label A "Data", B "Data"');
    query.send(handleQueryResponseSummaryTable);
}

// Draw Winds Aloft Table
function drawVisualizationWindsAloftTable() {
    var query = new google.visualization.Query('https://spreadsheets.google.com/tq?key=1w8UB-Imka7JI08iViCiwpJ1VPSUQBPG1WA-yl7I7st8&output=html&usp=sharing');
    //query.setQuery('SELECT A, B, C label A "Data", B "Data", C"Data"');
    query.send(handleQueryResponseWindsAloftTable);
}


// Get spreadsheet data for Summary Table
function handleQueryResponseSummaryTable(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('summaryTable'));
    visualization.draw(data, {
        allowHtml: true
    });
}

// Get spreadsheet data for Winds Aloft Table
function handleQueryResponseWindsAloftTable(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('windsAloftTable'));
    visualization.draw(data, {
        allowHtml: true
    });
}

// Execute callback to draw Summary Table
google.setOnLoadCallback(drawVisualizationSummaryTable);

// Execute callback to draw Winds Aloft Table
google.setOnLoadCallback(drawVisualizationWindsAloftTable);