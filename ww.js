// -------------------------------
// -------------------------------
// G L O B A L   V A R I A B L E S
// -------------------------------
// -------------------------------

    var today = new Date();
    var yyyy = today.getFullYear();
    var monthName = today.toLocaleString('en-us', {month: 'short'});
    var monthNum = today.getMonth() + 1;
    var twoDigitMonth = (monthNum < 10) ? "0" + monthNum : monthNum;
    var dayName = today.toLocaleDateString('en-us', {weekday: 'short'});
    var dayNum = today.getDate();
    var twoDigitDay = (dayNum < 10) ? "0" + dayNum : dayNum;
    var hour = today.getHours();

// -------------------------------------------
// -------------------------------------------
// N O A A   S T A N D A R D   F O R E C A S T
// -------------------------------------------
// -------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaafdata) {
    
    // Find URL for current weather image, add html for display
    var noaaCurrentImg = String('<a href="https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XN8LtchKhPY" target="_blank"><img src="https://forecast.weather.gov/newimages/' + noaafdata.contents.match(/large?\S*png/) + '" height=85px></a>');
    
    // Find string for current conditions/sky cover
    var noaaCurrentSky = String(noaafdata.contents.match(/nt">.*(?=<\Sp>)/));
    noaaCurrentSky = noaaCurrentSky.substr(4);
    
    // Find string for current temp
    var noaaCurrentTemp = String(noaafdata.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaHighTemp = String(noaafdata.contents.match(/\d{1,3}(?=\s&deg)/));
    
    // Find string for current pressure
    var noaaCurrentPres = String(noaafdata.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));
    
    document.getElementById('noaa-current-img').innerHTML = noaaCurrentImg;
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp + "&deg F<span style='font-size:50%;'> &nbsp;&nbsp;(" + noaaHighTemp + ")</span>";
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres + " in";

});

// -----------------------------------------------
// -----------------------------------------------
// W I N D   S T A T I O N   T I M E   S E R I E S
// -----------------------------------------------
// -----------------------------------------------

var xhrTimeSeries = new XMLHttpRequest(); // xhr to hold the timeseries JSON data for KSLC
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=KSLC&stid=OC1WX&stid=C8948&stid=OGP&stid=PKC&recent=60&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction,wind_cardinal_direction&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
    if (xhrTimeSeries.status === 200) { // 200 indicates successful query
        var weatherData = JSON.parse(xhrTimeSeries.responseText);
        //console.log(weatherData); // For troubleshooting
        
        // Station Order: 0=KSLC, 1=Ogden Peak, 2=Park City Jupiter, 3=Olympus Cove, 4=Centerville
        
        var stationsCount = weatherData.STATION.length;
        var stationObservationsCount = [], stationName = [], stationHour = [], stationAMPM = [], stationMins = [], latestTimes = [], windSpeeds = [], windGusts = [], windDirCards = [], windDirImgs = [], windDirURLs = [];
        
        // This loop extracts most recent data for each station reading
        for (i=0; i<stationsCount; i++) {
            stationObservationsCount[i] = weatherData.STATION[i].OBSERVATIONS.date_time.length - 1;
        }
        // This loop extracts station name for each station
        for (i=0; i<stationsCount; i++) {
            stationName[i] = weatherData.STATION[i].STID;
            stationName[i] = (stationName[i] == "OGP") ? "Ogden Pk" : stationName[i];
            stationName[i] = (stationName[i] == "PKC") ? "Jupiter" : stationName[i];
            stationName[i] = (stationName[i] == "OC1WX") ? "Olympus" : stationName[i];
            stationName[i] = (stationName[i] == "C8948") ? "Legacy" : stationName[i];
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
                    stationHour[i] -= 12;
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
                        windDirImgs[i] += 180;
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

// ---------------------------------------------------
// ---------------------------------------------------
// W I N D   &   S K Y   I M A G E   A N I M A T I O N
// ---------------------------------------------------
// ---------------------------------------------------

function forecastedImgLoop(loopId, imgType) {
  var rotator = document.getElementById(loopId);
  var delay = 1800;
  var startTime = 1;
  var images = [];
  
  if (hour > 19 || hour < 8) { //Switch to next day images if after 7pm, switch back after 7am
      startTime += 4;
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

// -------------------------------
// -------------------------------
// S O A R I N G   F O R E C A S T
// -------------------------------
// -------------------------------

var soaringForecastURL = "https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(soaringForecastURL) + '&callback=?', function(soarForecastData) {
    
// Report date
    var soarForecastReportWkDay = String(soarForecastData.contents.match(/(?<=r|R\s).+(?=DAY,|day,)/));
    soarForecastReportWkDay = soarForecastReportWkDay.substr(0,1) + soarForecastReportWkDay.substr(1).toLowerCase();
    
    var soarForecastReportMonth = String(soarForecastData.contents.match(/(?<=DAY,\s|day,\s).+(?=\s\d{1,2},)/));
    soarForecastReportMonth = soarForecastReportMonth.substr(0,1) + soarForecastReportMonth.substr(1).toLocaleLowerCase();
    
    var soarForecastReportDate = String(soarForecastData.contents.match(/\d{1,2}(?=,\s2019)/));
    
    var soarForecastReportFullDate = soarForecastReportWkDay + ", " + soarForecastReportMonth + " " + soarForecastReportDate;
    
// Max rate of lift
    var maxRateOfLift = parseInt(soarForecastData.contents.match(/\d{1,4}(?=\sFT\SMIN|\sft\Smin)/)).toLocaleString();
    
// Top of lift
    var topOfLift = parseInt(soarForecastData.contents.match(/(?<=ALS.+\s|als.+\s).\d{1,5}(?=\sFT\sMSL|\sft\smsl)/)).toLocaleString();
    
// Height of the -3 index
    var neg3Index = parseInt(soarForecastData.contents.match(/(?<=DEX.+\s|dex.+\s).\d{1,5}(?=\sFT\sMSL|\sft\smsl)/)).toLocaleString();

// Overdevelopment time
    var od = String(soarForecastData.contents.match(/(?<=ENT.+\s|ent.+\s)\d{4}/));
    if (od != "None" || od != "NONE") {
        var odFirst2 = parseInt(od.substr(0,2));
        var odAMPM = (odFirst2 > 11) ? " pm" : " am";
        odFirst2 = (odFirst2 > 12) ? odFirst2 -= 12 : odFirst2;
        od = String(odFirst2) + ":" + od.substr(2,4) + odAMPM;
    }

    document.getElementById('soar-forecast-report-date').innerHTML = soarForecastReportFullDate;
    document.getElementById('max-rol').innerHTML = maxRateOfLift + "<span style='font-size:50%;'> &nbsp;&nbsp;(" + Math.round((maxRateOfLift / 196.85) * 10) / 10 + " m/s)</span>";
    document.getElementById('top-of-lift').innerHTML = topOfLift;
    document.getElementById('neg3-index').innerHTML = neg3Index;
    document.getElementById('od-time').innerHTML = od;
});

// ---------------------
// ---------------------
// W I N D S   A L O F T
// ---------------------
// ---------------------

// This block determines which of 3 forecasts to get (6, 12, or 24 hr)
    var fcastRange = "12";
    if (hour >= 14 && hour <= 19) {
        fcastRange = "06";
    } else if (hour > 19 || hour <=3) {
        fcastRange = "24";
    }

// Scrape data as "windAloftData", stored in "windAloftData.contents"
    var windAloftForecastURL = "https://www.aviationweather.gov/windtemp/data?level=low&fcst=" + fcastRange + "&region=slc&layout=on&date=";
    $.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(windAloftForecastURL) + '&callback=?', function(windAloftData) {

// Extract forecast start & end time (zulu), convert to mountain (-6 for summer)
    var fcastStartTime = windAloftData.contents.match(/\d{2}(?=\d{2}-\d{4}Z)/);
    var fcastStartTimeAMPM = " am";
    var fcastEndTimeAMPM = " am";
    fcastStartTime = parseInt(fcastStartTime) - 6;
    if (fcastStartTime == 12) {
        fcastStartTime = "Noon";
    }
    if (fcastStartTime > 12) {
        fcastStartTime = fcastStartTime - 12;
        fcastStartTimeAMPM = " pm";
    }
    fcastStartTime = fcastStartTime + fcastStartTimeAMPM;

    var fcastEndTime = windAloftData.contents.match(/\d{2}(?=\d{2}Z.\sTEMPS)/);
    fcastEndTime = parseInt(fcastEndTime) - 6;
    if (fcastEndTime == 0) {
        fcastEndTime = "Midnight";
    }
    if (fcastEndTime < 0) {
        fcastEndTime += 12;
        fcastEndTimeAMPM = " pm";
    }
    fcastEndTime = fcastEndTime + fcastEndTimeAMPM;

    var fcastDay;
    if (fcastRange == "24" && hour > 19) {
        fcastDay = " (tomorrow)";
    } else {
        fcastDay = "";
    }

    document.getElementById('winds-aloft-forecast-start').innerHTML = fcastStartTime;
    document.getElementById('winds-aloft-forecast-end').innerHTML = fcastEndTime;
    document.getElementById('winds-aloft-forecast-day').innerHTML = fcastDay;

// Extract data group for SLC for direction, speed, and temp for 6k, 9k, 12k, and 18k
    var slcLine = String(windAloftData.contents.match(/(?<=SLC\s{6}).+(?=\s\d{4}-)/));
    var windAloftDirs = [], windAloftSpds = [], windAloftTmps = [];
    for (i=0; i<4; i++) {
        windAloftDirs[i] = slcLine.substr(i*8,2);
        if (windAloftDirs[i] == 99) {
            windAloftDirs[i] = "calm";
        } else {
            windAloftDirs[i] = windAloftDirs[i] * 10;
        }
        if (windAloftDirs[i] > 180) {
            windAloftDirs[i] = "a" + (windAloftDirs[i] - 180);
        }
        windAloftDirs[i] = String('<img src="https://www.usairnet.com/weather/winds_aloft/' + windAloftDirs[i] + '.gif" height=100px>');
        
        windAloftSpds[i] = Math.round(parseFloat(slcLine.substr(i*8+2,2) * 1.15078));
        if (windAloftSpds[i] == 0) {
            windAloftSpds[i] = "--";
        }
        
        windAloftTmps[i] = slcLine.substr(i*8+5,2);
        if (slcLine.substr(i*8+4,1) == "-") {
            windAloftTmps[i] = windAloftTmps[i] * -1;
        }
        windAloftTmps[i] = Math.round(windAloftTmps[i] * (9/5) + 32);
    }
    windAloftTmps[0] = "--"; // No temp reading for 6k

    document.getElementById('wind-aloft-6k-spd').innerHTML = windAloftSpds[0];
    document.getElementById('wind-aloft-9k-spd').innerHTML = windAloftSpds[1];
    document.getElementById('wind-aloft-12k-spd').innerHTML = windAloftSpds[2];
    document.getElementById('wind-aloft-18k-spd').innerHTML = windAloftSpds[3];

    document.getElementById('wind-aloft-6k-dir').innerHTML = windAloftDirs[0];
    document.getElementById('wind-aloft-9k-dir').innerHTML = windAloftDirs[1];
    document.getElementById('wind-aloft-12k-dir').innerHTML = windAloftDirs[2];
    document.getElementById('wind-aloft-18k-dir').innerHTML = windAloftDirs[3];

    document.getElementById('wind-aloft-6k-tmp').innerHTML = windAloftTmps[0];
    document.getElementById('wind-aloft-9k-tmp').innerHTML = windAloftTmps[1];
    document.getElementById('wind-aloft-12k-tmp').innerHTML = windAloftTmps[2];
    document.getElementById('wind-aloft-18k-tmp').innerHTML = windAloftTmps[3];
});