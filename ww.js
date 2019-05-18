// Scrape NOAA Forecast data via JQuery, bypassing CORS with whateverorigin
// ------------------------------------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaafdata) {
    
    // Find URL for current weather image, add html for display
    var noaaCurrentImg = String('<a href="https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XN8LtchKhPY" target="_blank"><img src="https://forecast.weather.gov/newimages/' + noaafdata.contents.match(/large?\S*png/) + '" height=200px></a>');
    document.getElementById('noaa-current-img').innerHTML = noaaCurrentImg;
    
    // Find string for current conditions/sky cover
    var noaaCurrentSky = String(noaafdata.contents.match(/t">(?:\s*\w+){1,3}(?=<\Sp>)/));
    noaaCurrentSky = noaaCurrentSky.substr(3);
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    
    // Find string for current temp
    var noaaCurrentTemp = String(noaafdata.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaHighTemp = String(noaafdata.contents.match(/\d{1,3}(?=\s&deg)/));
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp + "&deg F<span style='color:white; font-size:60%;'> &nbsp;(" + noaaHighTemp + ")</span>";
    
    // Find string for current pressure
    var noaaCurrentPres = String(noaafdata.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres + " in";
    
});

// Get KSLC timeseries data in JSON format via API, parse, and modify for output
// -----------------------------------------------------------------------------

var xhrTimeSeries = new XMLHttpRequest(); // xhr to hold the timeseries JSON data for KSLC
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=kslc&stid=OC1WX&recent=120&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction,wind_cardinal_direction&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
    if (xhrTimeSeries.status === 200) { // 200 indicates successful query
        var weatherData = JSON.parse(xhrTimeSeries.responseText);
        //console.log(weatherData); // For troubleshooting
        
    // KSLC Data
        var kslcDataArrayLength = weatherData.STATION[0].OBSERVATIONS.date_time.length - 1; // Returned array varies; need to know where it ends to get most recent data point

        // Get date (format "ddd, mmm dd") & most recent time (adjust for 12h)
        var reportMonth = weatherData.STATION[0].OBSERVATIONS.date_time[kslcDataArrayLength].substr(0, 3);
        var reportDay = weatherData.STATION[0].OBSERVATIONS.date_time[kslcDataArrayLength].substr(4, 2);
            if (parseInt(reportDay) < 10) {
                reportDay = reportDay.substr(1, 1);
            }
        var ampm = " am";
        var dateHour = parseInt(weatherData.STATION[0].OBSERVATIONS.date_time[kslcDataArrayLength].substr(9, 2));
            if (dateHour > 11) {
                ampm = " pm";
                if (dateHour > 12) {
                    dateHour = dateHour - 12;
                }
            }
        var latestTime = dateHour + ":" + weatherData.STATION[0].OBSERVATIONS.date_time[kslcDataArrayLength].substr(12, 2) + ampm;
        var dateToday = new Date();
        var weekdayNumber = dateToday.getDay();
        var weekdays = [];
            weekdays[0] = "Sun";
            weekdays[1] = "Mon";
            weekdays[2] = "Tue";
            weekdays[3] = "Wed";
            weekdays[4] = "Thu";
            weekdays[5] = "Fri";
            weekdays[6] = "Sat";
        var weekday = weekdays[weekdayNumber];
        var dateAndTime = weekday + ", " + reportMonth + " " + reportDay + " @ " + latestTime;
        document.getElementById('kslc-time').innerHTML = latestTime;
        document.getElementById('kslc-date-time').innerHTML = dateAndTime;

        // Get wind direction image
        var windDir = weatherData.STATION[0].OBSERVATIONS.wind_direction_set_1[kslcDataArrayLength];
            if (windDir > 180) {
                windDir = windDir - 180;
            } else {
                windDir = windDir + 180;
            }
        var windDirURL = "<img src='https://www.usairnet.com/weather/winds_aloft/a" + windDir + ".gif'>";
        document.getElementById('kslc-wind-dir-img').innerHTML = windDirURL;

        // Get wind direction cardinal
        var windDirCard = weatherData.STATION[0].OBSERVATIONS.wind_cardinal_direction_set_1d[kslcDataArrayLength];
        document.getElementById('kslc-wind-dir-card').innerHTML = windDirCard;

        // Get wind speed, round to integer
        var windSpeed = Math.round(weatherData.STATION[0].OBSERVATIONS.wind_speed_set_1[kslcDataArrayLength]);
        document.getElementById('kslc-wind-speed').innerHTML = windSpeed;

        // Get wind gust, round to integer, "--" if no gust
        try {
            var windGust = Math.round(weatherData.STATION[0].OBSERVATIONS.wind_gust_set_1[kslcDataArrayLength]);
        }
        catch(err) {
            var windGust = "--";
        }
        if (windGust == 0) {
            windGust = "--";
        }
        document.getElementById('kslc-wind-gust').innerHTML = windGust;
        
    // Olympus MSI Data
        var omsiDataArrayLength = weatherData.STATION[1].OBSERVATIONS.date_time.length - 1; // Returned array varies; need to know where it ends to get most recent data point
        
        // Get wind speed, round to integer
        //var windSpeed = Math.round(weatherData.STATION[0].OBSERVATIONS.wind_speed_set_1[kslcDataArrayLength]);
        //document.getElementById('kslc-wind-speed').innerHTML = windSpeed;

    } else {
        return "Data Error";
    }
}

// Scrape online Soaring Forecast text data via JQuery (in HTML <head>), bypassing CORS with whateverorigin.org
// ------------------------------------------------------------------------------------------------------------

var soaringForecastURL = "https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(soaringForecastURL) + '&callback=?', function(sfdata) {
    //console.log(sfdata); // For troubleshooting
    // Split page text content into individual lines
    var sfLines = sfdata.contents.split("\n");

    // Extract weekday, month, and 1-2 digit day for report date from line 7
    var reportWkDay = sfLines[7].substr(21, 3);
    var reportMonth = String(sfLines[7].match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/));
    var reportDay = String(sfLines[7].match(/\d{1,2}/));
    var reportDate = reportWkDay + ", " + reportMonth + " " + reportDay;
    document.getElementById('report-date').innerHTML = reportDate;

    // Extract Max Rate of Lift (maxRol) from line 11 for up to 4 digits, format for comma (toLocaleString)
    var maxRateOfLift = parseInt(sfLines[11].match(/\d{1,4}/)).toLocaleString();
    document.getElementById('max-rol').innerHTML = maxRateOfLift;

    // Extract Top of Lift (liftTop) from line 12 for up to 5 digits, format for comma (toLocaleString)
    var topOfLift = parseInt(sfLines[12].match(/\d{4,5}/)).toLocaleString();
    document.getElementById('top-of-lift').innerHTML = topOfLift;

    // Extract OD (od) "None" or converted time ('1430' to '2:30 pm') from line 16
    var ampm;
    var od = sfLines[16].substr(48, 4);
    if (od != "None") {
        var odFirst2 = parseInt(od.substr(0, 2));
        if (odFirst2 > 11) {
            ampm = " pm";
        } else {
            ampm = " am";
        }
        if (odFirst2 > 12) {
            odFirst2 = odFirst2 - 12;
        }
        od = String(odFirst2) + ":" + od.substr(2, 4) + ampm;
    }
    document.getElementById('od-time').innerHTML = od;

    // Extract height of the -3 index (neg3) from line 19 for up to 5 digits, format for comma (toLocaleString)
    var neg3Array = sfLines[19].match(/\d{1,5}/g);
    var neg3Index = parseInt(neg3Array[1]).toLocaleString();
    document.getElementById('neg3-index').innerHTML = neg3Index;

});