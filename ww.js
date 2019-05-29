// Global variables
// ----------------
// ----------------
    
    // For comparing current month & date to report month & date
    var today = new Date(); // Get today's date
    var yyyy = today.getFullYear();
    var monthName = today.toLocaleString('en-us', {month: 'short'}); // Get month short format "mmm"
    var monthNum = today.getMonth() + 1;
    var twoDigMonthNum;
        if (monthNum < 10) {
            twoDigMonthNum = "0" + monthNum;
        }
    var dayNum = String(today.getDate()); // Get date #

// Scrape & search NOAA Forecast data via JQuery, bypassing CORS with whateverorigin
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaafdata) {
    
    // Find URL for current weather image, add html for display
    var noaaCurrentImg = String('<a href="https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XN8LtchKhPY" target="_blank"><img src="https://forecast.weather.gov/newimages/' + noaafdata.contents.match(/large?\S*png/) + '" height=85px></a>');
    document.getElementById('noaa-current-img').innerHTML = noaaCurrentImg;
    
    // Find string for current conditions/sky cover
    var noaaCurrentSky = String(noaafdata.contents.match(/nt">.*(?=<\Sp>)/));
    noaaCurrentSky = noaaCurrentSky.substr(4);
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    
    // Find string for current temp
    var noaaCurrentTemp = String(noaafdata.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaHighTemp = String(noaafdata.contents.match(/\d{1,3}(?=\s&deg)/));
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp + "&deg F<span style='color:white; font-size:50%;'> &nbsp;(" + noaaHighTemp + ")</span>";
    
    // Find string for current pressure
    var noaaCurrentPres = String(noaafdata.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres + " in";

});

// Get timeseries data for key stations in JSON format via API, parse, and modify for output
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

var xhrTimeSeries = new XMLHttpRequest(); // xhr to hold the timeseries JSON data for KSLC
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=KSLC&stid=OC1WX&stid=C8948&stid=OGP&stid=PKC&recent=60&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction,wind_cardinal_direction&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
    if (xhrTimeSeries.status === 200) { // 200 indicates successful query
        var weatherData = JSON.parse(xhrTimeSeries.responseText);
        console.log(weatherData); // For troubleshooting
        
        // Station Order: 0=KSLC, 1=Ogden Peak, 2=Park City Jupiter, 3=Olympus Cove, 4=Centerville
        
        var stationsCount = weatherData.STATION.length;
        var stationObservationsCount = [];
        var stationName = [];
        var stationHour = [];
        var stationAMPM = [];
        var stationMins = [];
        var latestTimes = [];
        var windSpeeds = [];
        var windGusts = [];
        var windDirCards = [];
        var windDirImgs = [];
        var windDirURLs = [];
        
        // This loop extracts most recent data for each station reading
        for (i=0; i<stationsCount; i++) {
            stationObservationsCount[i] = weatherData.STATION[i].OBSERVATIONS.date_time.length - 1;
        }
        // This loop extracts station name for each station
        for (i=0; i<stationsCount; i++) {
            stationName[i] = weatherData.STATION[i].STID;
        }
        document.getElementById('station0-name').innerHTML = stationName[0];
        document.getElementById('station1-name').innerHTML = stationName[1];
        document.getElementById('station2-name').innerHTML = stationName[2];
        document.getElementById('station3-name').innerHTML = stationName[3];
        document.getElementById('station4-name').innerHTML = stationName[4];
            
        // This loop extracts the most recent hour and determines am or pm for each station reading
        for (i=0; i<stationsCount; i++) {
            stationHour[i] = parseInt(weatherData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(9,2));
            if (stationHour[i] > 11) {
                stationAMPM[i] = " pm";
                if (stationHour[i] > 12) {
                    stationHour[i] = stationHour[i] - 12;
                }
            }
            if (stationHour[i] == 0) {
                stationHour[i] = 12;
                stationAMPM[i] = " am";
            }
            stationAMPM[i] = " pm";
        }
        // This loop extracts the most recent minute for each station reading
        for (i=0; i<stationsCount; i++) {
            stationMins[i] = weatherData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(12, 2);
        }
        // This loop concatenates the hour and minute for each station reading
        for (i=0; i<stationsCount; i++) {
            latestTimes[i] = stationHour[i] + ":" + stationMins[i] + stationAMPM[i];
        }
        document.getElementById('station0-time').innerHTML = latestTimes[0];
        document.getElementById('station1-time').innerHTML = latestTimes[1];
        document.getElementById('station2-time').innerHTML = latestTimes[2];
        document.getElementById('station3-time').innerHTML = latestTimes[3];
        document.getElementById('station4-time').innerHTML = latestTimes[4];
                
        // This loop rounds and loads wind speed & wind gust for each station reading, "--" if null
        for (i=0; i<stationsCount; i++) {
            try {
                windSpeeds[i] = Math.round(weatherData.STATION[i].OBSERVATIONS.wind_speed_set_1[stationObservationsCount[i]]);
            }
            catch(err) {
                windSpeeds[i] = "--";
            }
            if (windSpeeds[i] == 0) {
                windSpeeds[i] = "--";
            }
            try {
                windGusts[i] = Math.round(weatherData.STATION[i].OBSERVATIONS.wind_gust_set_1[stationObservationsCount[i]]);
            }
            catch(err) {
                windGusts[i] = "--";
            }
            if (windGusts[i] == 0) {
                windGusts[i] = "--";
            }
        }
        document.getElementById('station0-wind-speed').innerHTML = windSpeeds[0];
        document.getElementById('station1-wind-speed').innerHTML = windSpeeds[1];
        document.getElementById('station2-wind-speed').innerHTML = windSpeeds[2];
        document.getElementById('station3-wind-speed').innerHTML = windSpeeds[3];
        document.getElementById('station4-wind-speed').innerHTML = windSpeeds[4];
        document.getElementById('station0-wind-gust').innerHTML = windGusts[0];
        document.getElementById('station1-wind-gust').innerHTML = windGusts[1];
        document.getElementById('station2-wind-gust').innerHTML = windGusts[2];
        document.getElementById('station3-wind-gust').innerHTML = windGusts[3];
        document.getElementById('station4-wind-gust').innerHTML = windGusts[4];

        // This loop extracts wind direction cardinal for each station
        for (i=0; i<stationsCount; i++) {
            try {
                windDirCards[i] = weatherData.STATION[i].OBSERVATIONS.wind_cardinal_direction_set_1d[stationObservationsCount[i]];
            }
            catch(err) {
                windDirCards[i] = "--";
            }
            if (windDirCards[i] == null) {
                windDirCards[i] = "--";
            }
        }
        document.getElementById('station0-wind-dir-card').innerHTML = windDirCards[0];
        document.getElementById('station1-wind-dir-card').innerHTML = windDirCards[1];
        document.getElementById('station2-wind-dir-card').innerHTML = windDirCards[2];
        document.getElementById('station3-wind-dir-card').innerHTML = windDirCards[3];
        document.getElementById('station4-wind-dir-card').innerHTML = windDirCards[4];
        
        // This loop gets wind direction image for each station
        for (i=0; i<stationsCount; i++) {
            try {
                windDirImgs[i] = weatherData.STATION[i].OBSERVATIONS.wind_direction_set_1[stationObservationsCount[i]];
                if (windDirImgs[i] != null) {
                    windDirImgs[i] = Math.round(windDirImgs[i] / 10) * 10;
                    if (windDirImgs[i] > 180) {
                        windDirImgs[i] = windDirImgs[i] - 180;
                    } else {
                        windDirImgs[i] = windDirImgs[i] + 180;
                    }
                    windDirURLs[i] = "<img src='https://www.usairnet.com/weather/winds_aloft/a" + windDirImgs[i] + ".gif'>";
                } else {
                    windDirURLs[i] = "<img src='http://www.usairnet.com/weather/winds_aloft/calm.gif'>";
                }
            }
            catch(err) {
                windDirURLs[i] = "--";
            }
        }
        document.getElementById('station0-wind-dir-img').innerHTML = windDirURLs[0];
        document.getElementById('station1-wind-dir-img').innerHTML = windDirURLs[1];
        document.getElementById('station2-wind-dir-img').innerHTML = windDirURLs[2];
        document.getElementById('station3-wind-dir-img').innerHTML = windDirURLs[3];
        document.getElementById('station4-wind-dir-img').innerHTML = windDirURLs[4];

    } else {
        return "Data Error";
    }
}

// Scrape online Soaring Forecast text data via JQuery (in HTML <head>), bypassing CORS with whateverorigin.org
// ------------------------------------------------------------------------------------------------------------
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

// Animate forecasted images for NOAA wind and sky
// -----------------------------------------------
// -----------------------------------------------

function forecastedImgLoop(loopId, imgType) {
  var rotator = document.getElementById(loopId);
  var delay = 1800;
  var startTime = 1;
  var images = [];
  
  if (today.getHours() > 19 || today.getHours() < 8) { //Switch to next day images if after 7pm, switch back after 7am
      startTime = startTime + 4;
  }
    
  for (i = 0; i < 6; i++) { //Load images array
      images[i] = `https://graphical.weather.gov/images/slc/${imgType}${i + startTime}_slc.png`;
  }
  
  if (startTime === 5) { //Duplicate afternoon img for visual pause
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/"+imgType+"7_slc.png"); //Next day
  } else {
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/"+imgType+"3_slc.png"); //Current day
  }

  var loopCount = 0;
  var changeImage = function() {
      rotator.src = images[loopCount++];
      if (loopCount == 6) {
          loopCount = 0;
      }
};

setInterval(changeImage, delay); //Rotate images
};

forecastedImgLoop;