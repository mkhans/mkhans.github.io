// Draw Northside Tables --------------------------------------------------------------------------------------------

google.charts.load('current', {packages: ['table', 'corechart']}); //Initialize Google Table API
google.charts.setOnLoadCallback(drawTable);

var fpnStationTableURL = 'https://spreadsheets.google.com/tq?key=1NE_sLJtvxuOLVt8NgZgn8e3TmjpRKBOAa-bT0pZVvuU&output=html&usp=sharing';
var ku42StationTableURL = 'https://spreadsheets.google.com/tq?key=1NE_sLJtvxuOLVt8NgZgn8e3TmjpRKBOAa-bT0pZVvuU&output=html&gid=1503493220&usp=sharing';
var windCompareURL = 'https://spreadsheets.google.com/tq?key=1NE_sLJtvxuOLVt8NgZgn8e3TmjpRKBOAa-bT0pZVvuU&output=html&gid=789526312&usp=sharing';

function drawTable() {
    var fpnStationData = new google.visualization.Query(fpnStationTableURL);
    var ku42StationData = new google.visualization.Query(ku42StationTableURL);
    var windCompareData = new google.visualization.Query(windCompareURL);
    fpnStationData.send(handleFPNStationQuery);
    ku42StationData.send(handleKU42StationQuery);
    windCompareData.send(handleWindCompareQuery);
}

function handleFPNStationQuery(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('FPNStationTable'));
    visualization.draw(data, {allowHtml: true});
}

function handleKU42StationQuery(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('KU42StationTable'));
    visualization.draw(data, {allowHtml: true});
}

function handleWindCompareQuery(response) {
    var data = response.getDataTable();
    var options = {
        height: 600,
        curveType: 'function',
        interpolateNulls: true,
        hAxis: {
            title: 'Last 2 Hours',
            slantedTextAngle: 70},
        vAxis: {
            title: 'Wind Speed (mph)'},
    };
    visualization = new google.visualization.LineChart(document.getElementById('WindCompareChart'));
    visualization.draw(data, options);
}
