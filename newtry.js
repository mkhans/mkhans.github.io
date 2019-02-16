// ID of the Google Spreadsheet
 var spreadsheetID = "1MCJ7LtG1WKpQ7Nxx60krnsjmmdO9UC_Uhypx9w5txCs";
 
 // Make sure it is public or set to Anyone with link can view 
 var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/2/public/values?alt=json";
 
// make JSON call to Google Data API
$.getJSON(url, function(data) {

  // set global html variable
  var html = '';

  // build table headings
  html += '<table cellpadding=10 cellspacing=0 border=1>';
  html += '<tr>';
  html += '<th>Name</th>';
  html += '<th>Gender</th>';
  html += '<th>Class Level</th>';
  html += '<th>Home State</th>';
  html += '<th>Major</th>';
  html += '<th>Extra Curricular Activity</th>';
  html += '</tr>';
  
  // loop to build html output for each row
  var entry = data.feed.entry;
  /**
  ** Change to descending order
  ** for (var i = entry.length - 1; i >= 0; i -= 1) {
   */
  for (var i = 0; i < entry.length; i++) {
    html += '<tr>';
    html += '<td>' + entry[i]['gsx$studentname']['$t'] + '</td>';
    html += '<td>' + entry[i]['gsx$gender']['$t'] + '</td>';
    html += '<td>' + entry[i]['gsx$classlevel']['$t'] + '</td>';
    html += '<td>' + entry[i]['gsx$homestate']['$t'] + '</td>';
    html += '<td>' + entry[i]['gsx$major']['$t'] + '</td>';
    html += '<td>' + entry[i]['gsx$extracurricularactivity']['$t'] + '</td>';
    html += '</tr>';
  }
  html += '</table>';

  // output html
  $('.console').html(html);
});

// loading animation
var loading = $('.loading');
loading.hide();
$(document)
  .ajaxStart(function() {
    loading.show();
  })
  .ajaxStop(function() {
    loading.hide();
  });
