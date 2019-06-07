// -------------------------------
// -------------------------------
// G L O B A L   V A R I A B L E S
// -------------------------------
// -------------------------------

    var today = new Date();
    var yyyy = today.getFullYear();
    var monthName = today.toLocaleString('en-us', {month: 'short'});
    var monthNum = today.getMonth() + 1;
    var month2Digit = (monthNum < 10) ? "0" + monthNum : monthNum;
    var dayName = today.toLocaleDateString('en-us', {weekday: 'short'});
    var dayNum = today.getDate();
    var day2Digit = (dayNum < 10) ? "0" + dayNum : dayNum;
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dayNumPlus1 = today.getDay() + 1;
    var dayNumPlus2 = today.getDay() + 2;
    var dayNumPlus3 = today.getDay() + 3;    
    var dayNamePlus1 = (dayNumPlus1 < 7) ? weekdays[dayNumPlus1] : weekdays[dayNumPlus1 - 7];
    var dayNamePlus2 = (dayNumPlus2 < 7) ? weekdays[dayNumPlus2] : weekdays[dayNumPlus2 - 7];
    var dayNamePlus3 = (dayNumPlus3 < 7) ? weekdays[dayNumPlus3] : weekdays[dayNumPlus3 - 7];
    var hour = today.getHours();
    var noaaImgURLBase = "https://forecast.weather.gov/";

// -------------------------------------------
// -------------------------------------------
// N O A A   S T A N D A R D   F O R E C A S T           !!!!!!!!!!!!!!!!!!!!Fix other .src Elements like noaaShortImg
// -------------------------------------------
// -------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaaForecastData) {
    
// CURRENT WEATHER IMAGE
    var noaaCurrentImg = noaaImgURLBase + noaaForecastData.contents.match(/(?<=src=").+large.+(?="\salt)/);
    
// SKY COVER
    var noaaCurrentSky = String(noaaForecastData.contents.match(/nt">.*(?=<\Sp>)/));
    noaaCurrentSky = noaaCurrentSky.substr(4);
    
// TEMP (CURRENT & NEXT)
    var noaaCurrentTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaNextTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=\s&deg)/));
    
// PRESSURE
    var noaaCurrentPres = String(noaaForecastData.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));

// SHORT TERM FORECAST
    var noaaShortImg = noaaImgURLBase + noaaForecastData.contents.match(/(?<=p><img\ssrc=").+(?="\salt)/);
    var noaaShortTime = String(noaaForecastData.contents.match(/(?<=name">).+(?=<\Sp>)/));
    noaaShortTime = (noaaShortTime == "This<br>Afternoon") ? "This Afternoon" : noaaShortTime;
    var noaaShortText = String(noaaForecastData.contents.match(/(?<=:\s).+(?="\stitle)/));
    
// 72 HOUR FORECAST
    var regexDay1Img = new RegExp('(?<=").+(?=".alt="' + dayNamePlus1 + ':)');
    var regexDay2Img = new RegExp('(?<=").+(?=".alt="' + dayNamePlus2 + ':)');
    var regexDay3Img = new RegExp('(?<=").+(?=".alt="' + dayNamePlus3 + ':)');
    var noaa72Day1Img = noaaImgURLBase + String(noaaForecastData.contents.match(regexDay1Img));
    var noaa72Day2Img = noaaImgURLBase + String(noaaForecastData.contents.match(regexDay2Img));
    var noaa72Day3Img = noaaImgURLBase + String(noaaForecastData.contents.match(regexDay3Img));
    var regexDay1Text = new RegExp('(?<=:.).+(?=.".title="' + dayNamePlus1 + ':)');
    var regexDay2Text = new RegExp('(?<=:.).+(?=.".title="' + dayNamePlus2 + ':)');
    var regexDay3Text = new RegExp('(?<=:.).+(?=.".title="' + dayNamePlus3 + ':)');
    var noaa72Day1Text = String(noaaForecastData.contents.match(regexDay1Text));
    var noaa72Day2Text = String(noaaForecastData.contents.match(regexDay2Text));
    var noaa72Day3Text = String(noaaForecastData.contents.match(regexDay3Text));
    
    
// GET ELEMENT BY ID
    document.getElementById('noaa-current-img').src = noaaCurrentImg;
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp + "&deg F<span style='font-size:50%;'> &nbsp;&nbsp;(" + noaaNextTemp + ")</span>";
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres + " in";
    document.getElementById('noaa-short-img').src = noaaShortImg;
    document.getElementById('noaa-short-time').innerHTML = noaaShortTime;
    document.getElementById('noaa-short-text').innerHTML = noaaShortText;
    document.getElementById('forecast-day1-img').src = noaa72Day1Img;
    document.getElementById('forecast-day2-img').src = noaa72Day2Img;
    document.getElementById('forecast-day3-img').src = noaa72Day3Img;
    document.getElementById('forecast-day1-name').innerHTML = dayNamePlus1;
    document.getElementById('forecast-day2-name').innerHTML = dayNamePlus2;
    document.getElementById('forecast-day3-name').innerHTML = dayNamePlus3;
    document.getElementById('forecast-day1-text').innerHTML = noaa72Day1Text;
    document.getElementById('forecast-day2-text').innerHTML = noaa72Day2Text;
    document.getElementById('forecast-day3-text').innerHTML = noaa72Day3Text;
    
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
    
// REPORT DATE
    var soarForecastReportWkDay = String(soarForecastData.contents.match(/(?<=r\s|R\s).+(?=DAY,|day,)/));
    soarForecastReportWkDay = soarForecastReportWkDay.substr(0,1) + soarForecastReportWkDay.substr(1).toLowerCase();
    var soarForecastReportMonth = String(soarForecastData.contents.match(/(?<=DAY,\s|day,\s).+(?=\s\d{1,2},)/));
    soarForecastReportMonth = soarForecastReportMonth.substr(0,1) + soarForecastReportMonth.substr(1).toLocaleLowerCase();
    var soarForecastReportDate = String(soarForecastData.contents.match(/\d{1,2}(?=,\s2019)/));
    var soarForecastReportFullDate = soarForecastReportWkDay + ", " + soarForecastReportMonth + " " + soarForecastReportDate;
    
// MAX RATE OF LIFT
    var maxRateOfLift = parseInt(soarForecastData.contents.match(/\d{1,4}(?=\sFT\SMIN|\sft\Smin)/));
    var maxRateOfLiftms = Math.round((maxRateOfLift / 196.85) * 10) / 10;
    maxRateOfLift = maxRateOfLift.toLocaleString() + "<span style='font-size:50%;'>&nbsp;&nbsp;&nbsp;(" + maxRateOfLiftms + " m/s)</span>";
    
// TOP OF LIFT
    var topOfLift = parseInt(soarForecastData.contents.match(/(?<=ALS.+\s|als.+\s).\d{1,5}(?=\sFT\sMSL|\sft\sMSL)/)).toLocaleString();
    
// HEIGHT OF THE -3 INDEX
    var neg3Index = parseInt(soarForecastData.contents.match(/(?<=DEX.+\s|dex.+\s).\d{1,5}(?=\sFT\sMSL|\sft\sMSL)/)).toLocaleString();

// OVERDEVELOPMENT TIME
    var od = String(soarForecastData.contents.match(/(?<=PMENT.+\s|pment.+\s).{4}/));
    if (parseInt(od)) {
        var odFirst2 = parseInt(od.substr(0,2));
        var odAMPM = (odFirst2 > 11) ? " pm" : " am";
        odFirst2 = (odFirst2 > 12) ? odFirst2 -= 12 : odFirst2;
        od = String(odFirst2) + ":" + od.substr(2,4) + odAMPM;
    }

// SUNSET TIME
    var sunsetTimeHr = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}:\d{2}\sMDT\n)/));
    sunsetTimeHr = (sunsetTimeHr > 12) ? sunsetTimeHr -= 12:sunsetTimeHr;
    var sunsetTimeMn = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}\sMDT\n)/));
    var sunsetTimeSs = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}\sMDT\n)/));
    sunsetTimeSs = (sunsetTimeSs > 30) ? 1:0;
    var sunsetTime = sunsetTimeHr + ":" + (sunsetTimeMn + sunsetTimeSs) + " pm";

// GET ELEMENT BY ID
    document.getElementById('soar-forecast-report-date').innerHTML = soarForecastReportFullDate;
    document.getElementById('max-rol').innerHTML = maxRateOfLift;
    document.getElementById('top-of-lift').innerHTML = topOfLift;
    document.getElementById('neg3-index').innerHTML = neg3Index;
    document.getElementById('od-time').innerHTML = od;
    document.getElementById('sunset-time').innerHTML = sunsetTime;
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
        fcastStartTimeAMPM = "";
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
        fcastEndTimeAMPM = "";
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
        windAloftDirs[i] = 'https://www.usairnet.com/weather/winds_aloft/' + windAloftDirs[i] + '.gif';
        
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

    document.getElementById('wind-aloft-6k-dir').src = windAloftDirs[0];
    document.getElementById('wind-aloft-9k-dir').src = windAloftDirs[1];
    document.getElementById('wind-aloft-12k-dir').src = windAloftDirs[2];
    document.getElementById('wind-aloft-18k-dir').src = windAloftDirs[3];

    document.getElementById('wind-aloft-6k-tmp').innerHTML = windAloftTmps[0];
    document.getElementById('wind-aloft-9k-tmp').innerHTML = windAloftTmps[1];
    document.getElementById('wind-aloft-12k-tmp').innerHTML = windAloftTmps[2];
    document.getElementById('wind-aloft-18k-tmp').innerHTML = windAloftTmps[3];
});