google.load('visualization', '1', {
    packages: ['table']
});
var visualization;

// Draw Summary Table
function drawVisualizationSummaryTable() {
    var query = new google.visualization.Query('https://spreadsheets.google.com/tq?key=1CpOU9TKZXwGu4h40TuGeVHI4fw8eMX_bube2AJY4taY&output=html&usp=sharing');
    //query.setQuery('SELECT A, B, C label A "Parameter", B "Reading", C "Time / Date"');
    query.send(handleQueryResponseSummaryTable);
}

// Draw Winds Aloft Table
function drawVisualizationWindsAloftTable() {
    var query = new google.visualization.Query('https://spreadsheets.google.com/tq?key=1w8UB-Imka7JI08iViCiwpJ1VPSUQBPG1WA-yl7I7st8&output=html&usp=sharing');
    //query.setQuery('SELECT A, B, C label A "Data", B "Data", C "Data"');
    query.send(handleQueryResponseWindsAloftTable);
}

// Get spreadsheet data for Summary Table
function handleQueryResponseSummaryTable(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('summaryTable'));
    visualization.draw(data, {
        allowHtml: true,
        showRowNumber: true
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

//--- --- ---

// Animate forecasted wind images
function forecastedWindLoop() {
  var rotator = document.getElementById('rotator');
  var delay = 1800;
  var time = new Date();
  var timejump = 1;
  var images = [];
  
  if (time.getHours() > 18) { //Switch to next day images if after 9pm
      timejump = timejump + 4;
  }
    
  for (i = 0; i < 6; i++) { //Load images array
      images[i] = `https://graphical.weather.gov/images/slc/WindSpd${i + timejump}_slc.png`;
  }
  
  if (timejump === 5) { //Duplicate 2/3pm for visual pause
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/WindSpd7_slc.png");
  } else {
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/WindSpd3_slc.png");
  }

  var loopCount = 0;
  var changeImage = function() {
      var length = images.length - 1;
      rotator.src = images[loopCount++];
      // document.write(images[loopCount++] + "<br>");
      if (loopCount == length) {
          loopCount = 0;
      }
};

setInterval(changeImage, delay); //Rotate images
};

forecastedWindLoop;
