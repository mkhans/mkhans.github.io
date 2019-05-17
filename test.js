// Scrape NOAA Forecast data via JQuery (in HTML <head>), bypassing CORS with whateverorigin.org
// ---------------------------------------------------------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaafdata) {
    
    // Find URL for current weather image, add html for display
    var noaaCurrentImg = String('<img src="https://forecast.weather.gov/newimages/' + noaafdata.contents.match(/large?\S*png/) + '" height=200px>');
    document.getElementById('noaa-current-img').innerHTML = noaaCurrentImg;
    
    // Find string for current conditions/sky cover
    var noaaCurrentSky = String(noaafdata.contents.match(/t">(?:\s*\w+){1,3}(?=<\Sp>)/));
    noaaCurrentSky = noaaCurrentSky.substr(3);
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    
    // Find string for current temp
    var noaaCurrentTemp = String(noaafdata.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaHighTemp = String(noaafdata.contents.match(/\d{1,3}(?=\s&deg)/));
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp + "&deg F<span style='color:#ffb380; font-size:60%;'> &nbsp;(" + noaaHighTemp + ")</span>";
    
    // Find string for current pressure
    var noaaCurrentPres = String(noaafdata.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres + " in";
    
});