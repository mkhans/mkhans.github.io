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
    var hour = today.getHours();
    var noaaImgURLBase = "https://forecast.weather.gov/";
    var windImgURLBase = "https://www.usairnet.com/weather/winds_aloft/";
    var scrapeURLBase = "https://whatever-origin.herokuapp.com/get?url=";

//----------------------------------------
//----------------------------------------
// Q U I C K   H T M L   F U N C T I O N S
//----------------------------------------
//----------------------------------------

$(document).ready (function todayFullDate() {
    document.getElementById('today-full-date').innerHTML = dayName + ", " + monthName + " " + dayNum;
});

$(document).ready (function slcRecentURL() {
    document.getElementById('slc-recent').src = "https://www.wunderground.com/cgi-bin/histGraphAll?day=" + day2Digit + "&year=" + yyyy + "&month=" + monthNum + "&ID=KSLC&type=3&width=614";
});

$(document).ready (function getSkewTURL(){
    document.getElementById('skewT').src = "https://climate.cod.edu/data/raob/KSLC/skewt/KSLC.skewt." + yyyy + month2Digit + day2Digit + ".12.gif";
});

// ---------------------------------------------------------
// ---------------------------------------------------------
// N O A A   S T A N D A R D   F O R E C A S T   S C R A P E
// ---------------------------------------------------------
// ---------------------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON(scrapeURLBase + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaaForecastData) {
    
// CURRENT WEATHER IMAGE
    var noaaCurrentImg = noaaImgURLBase + noaaForecastData.contents.match(/(?<=src=").+large.+(?="\salt)/);
    
// SKY COVER
    var noaaCurrentSky = String(noaaForecastData.contents.match(/(?<=ent">).*(?=<\Sp>)/));
    
// TEMP (CURRENT & NEXT)
    var noaaCurrentTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=&deg;F<)/));
    var noaaNextTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=\s&deg)/));
    noaaCurrentTemp = noaaCurrentTemp + "<span style='font-size:50%;'>&nbsp;&nbsp;&nbsp;(" + noaaNextTemp + ")</span>";
    
// PRESSURE
    var noaaCurrentPres = String(noaaForecastData.contents.match(/\d{1,2}.\d{1,2}(?=\sin)/));

// SHORT TERM FORECAST
    var noaaShortImg = noaaImgURLBase + noaaForecastData.contents.match(/(?<=p><img\ssrc=").+(?="\salt)/);
    var noaaShortTime = noaaForecastData.contents.match(/(?<=name">).+(?=<\Sp>)/g);
    noaaShortTime[1] = (noaaShortTime[1] == "This<br>Afternoon") ? "This Afternoon" : noaaShortTime[1];
    var noaaShortText = String(noaaForecastData.contents.match(/(?<=:\s).+(?="\stitle)/));
    
// 72 HOUR FORECAST
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var tomorrow = today.getDay() + 1;
    var forecastRegex = new RegExp;
    var forecastDays = [], forecastImgs = [], forecastTexts = [];
    for (i=0; i<3; i++) {
        tomorrow = (tomorrow + i < 7) ? tomorrow : tomorrow - 7;
        forecastDays[i] = weekdays[tomorrow + i];
        forecastRegex = '(?<=").+(?=".alt="' + weekdays[tomorrow + i] + ':)';
        forecastImgs[i] = noaaImgURLBase + String(noaaForecastData.contents.match(forecastRegex));
        forecastRegex = '(?<=:.).+(?=.".title="' + weekdays[tomorrow + i] + ':)';
        forecastTexts[i] = String(noaaForecastData.contents.match(forecastRegex));
    }

// GET ELEMENT BY ID
    document.getElementById('noaa-current-img').src = noaaCurrentImg;
    document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
    document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp;
    document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres;
    document.getElementById('noaa-short-img').src = noaaShortImg;
    document.getElementById('noaa-short-time').innerHTML = noaaShortTime[1];
    document.getElementById('noaa-short-text').innerHTML = noaaShortText;
    document.getElementById('forecast-day1-img').src = forecastImgs[0];
    document.getElementById('forecast-day2-img').src = forecastImgs[1];
    document.getElementById('forecast-day3-img').src = forecastImgs[2];
    document.getElementById('forecast-day1-name').innerHTML = forecastDays[0];
    document.getElementById('forecast-day2-name').innerHTML = forecastDays[1];
    document.getElementById('forecast-day3-name').innerHTML = forecastDays[2];
    document.getElementById('forecast-day1-text').innerHTML = forecastTexts[0];
    document.getElementById('forecast-day2-text').innerHTML = forecastTexts[1];
    document.getElementById('forecast-day3-text').innerHTML = forecastTexts[2];
});

// -------------------------------------------------------
// -------------------------------------------------------
// W I N D   S T A T I O N   T I M E   S E R I E S   A P I
// -------------------------------------------------------
// -------------------------------------------------------

var xhrTimeSeries = new XMLHttpRequest();
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=KSLC&stid=OC1WX&stid=C8948&stid=OGP&stid=PKC&recent=60&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction,wind_cardinal_direction&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
    var weatherData = JSON.parse(xhrTimeSeries.responseText);
    var stationsCount = weatherData.STATION.length;
    var stationObservationsCount = [], stationName = [], stationHour = [], stationAMPM = [], stationMins = [], latestTimes = [], windSpeeds = [], windGusts = [], windDirCards = [], windDirImgs = [];

// MOST RECENT READING FOR EACH STATION
    for (i=0; i<stationsCount; i++) {
        try {
            stationObservationsCount[i] = weatherData.STATION[i].OBSERVATIONS.date_time.length - 1;
        }
        catch(err) {
            stationObservationsCount[i] = "--";
        }
    }

// STATION NAMES
    for (i=0; i<stationsCount; i++) {
        try {
            stationName[i] = weatherData.STATION[i].STID;
            stationName[i] = (stationName[i] == "OGP") ? "Ogden Pk" : stationName[i];
            stationName[i] = (stationName[i] == "PKC") ? "Jupiter" : stationName[i];
            stationName[i] = (stationName[i] == "OC1WX") ? "Olympus" : stationName[i];
            stationName[i] = (stationName[i] == "C8948") ? "Legacy" : stationName[i];
        }
        catch(err) {
            stationName[i] = "--";
        }
    }

// MOST RECENT TIME
    for (i=0; i<stationsCount; i++) {
        try {
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
            stationMins[i] = weatherData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(12, 2);
            latestTimes[i] = stationHour[i] + ":" + stationMins[i] + stationAMPM[i];
        }
        catch(err) {
            latestTimes[i] = "--";
        }
    }

// ROUND & LOAD WIND SPEED & GUST, "--" IF NULL OR NO DATA
    for (i=0; i<stationsCount; i++) {
        try {
        windSpeeds[i] = weatherData.STATION[i].OBSERVATIONS.wind_speed_set_1[stationObservationsCount[i]];
        windSpeeds[i] = (parseInt(windSpeeds[i]) > 0) ? windSpeeds[i] = Math.round(windSpeeds[i]) : "--";
        }
        catch(err) {
            windSpeeds[i] = "--";
        }
        try {
        windGusts[i] = weatherData.STATION[i].OBSERVATIONS.wind_gust_set_1[stationObservationsCount[i]];
        windGusts[i] = (parseInt(windGusts[i]) > 0) ? windGusts[i] = Math.round(windGusts[i]) : "--";
        }
        catch(err) {
            windGusts[i] = "--";
        }
    }

// WIND DIRECTIONS CARDINAL
    for (i=0; i<stationsCount; i++) {
        try {
            windDirCards[i] = weatherData.STATION[i].OBSERVATIONS.wind_cardinal_direction_set_1d[stationObservationsCount[i]];
            windDirCards[i] = (windDirCards[i] == null) ? "--" : windDirCards[i];
        }
        catch(err) {
            windDirCards[i] = "--";
        }
    }

// WIND DIRECTION IMAGES
    for (i=0; i<stationsCount; i++) {
        try {
            windDirImgs[i] = weatherData.STATION[i].OBSERVATIONS.wind_direction_set_1[stationObservationsCount[i]];
            if (parseInt(windDirImgs[i]) >= 0) {
                windDirImgs[i] = Math.round(windDirImgs[i] / 10) * 10;
                windDirImgs[i] = (windDirImgs[i] > 180) ? windDirImgs[i] - 180 : windDirImgs[i] + 180;
                windDirImgs[i] = windImgURLBase + "a" + windDirImgs[i] + ".gif";
            } else {
                windDirImgs[i] = windImgURLBase + "calm.gif";
            }
        }
        catch(err) {
            windDirImgs[i] = windImgURLBase + "anodata.gif";
        }
    }

// GET ELEMENT BY ID
    document.getElementById('station0-name').innerHTML = stationName[0];
    document.getElementById('station1-name').innerHTML = stationName[1];
    document.getElementById('station2-name').innerHTML = stationName[2];
    document.getElementById('station3-name').innerHTML = stationName[3];
    document.getElementById('station4-name').innerHTML = stationName[4];
    document.getElementById('station0-time').innerHTML = latestTimes[0];
    document.getElementById('station1-time').innerHTML = latestTimes[1];
    document.getElementById('station2-time').innerHTML = latestTimes[2];
    document.getElementById('station3-time').innerHTML = latestTimes[3];
    document.getElementById('station4-time').innerHTML = latestTimes[4];
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
    document.getElementById('station0-wind-dir-card').innerHTML = windDirCards[0];
    document.getElementById('station1-wind-dir-card').innerHTML = windDirCards[1];
    document.getElementById('station2-wind-dir-card').innerHTML = windDirCards[2];
    document.getElementById('station3-wind-dir-card').innerHTML = windDirCards[3];
    document.getElementById('station4-wind-dir-card').innerHTML = windDirCards[4];
    document.getElementById('station0-wind-dir-img').src = windDirImgs[0];
    document.getElementById('station1-wind-dir-img').src = windDirImgs[1];
    document.getElementById('station2-wind-dir-img').src = windDirImgs[2];
    document.getElementById('station3-wind-dir-img').src = windDirImgs[3];
    document.getElementById('station4-wind-dir-img').src = windDirImgs[4];
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
    
  for (i=0; i<6; i++) { //Load images array
      images[i] = `https://graphical.weather.gov/images/slc/${imgType}${i + startTime}_slc.png`;
  }
  
  if (startTime == 5) { //Duplicate afternoon img for visual pause
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

setInterval(changeImage, delay);
};

forecastedImgLoop;

// ---------------------------------------------
// ---------------------------------------------
// S O A R I N G   F O R E C A S T   S C R A P E
// ---------------------------------------------
// ---------------------------------------------

var soaringForecastURL = "https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt";
$.getJSON(scrapeURLBase + encodeURIComponent(soaringForecastURL) + '&callback=?', function(soarForecastData) {
    
// REPORT DATE
    var soarForecastReportWkDay = String(soarForecastData.contents.match(/(?<=s\sfor\s|S\sFOR\s)[A-Z][a-zA-Z]{2}/));
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
    var topOfLift = parseInt(soarForecastData.contents.match(/(?<=ALS.+\s|als.+\s)\d{1,5}/)).toLocaleString();
    
// HEIGHT OF THE -3 INDEX
    var neg3Index = parseInt(soarForecastData.contents.match(/(?<=DEX.+\s|dex.+\s)\d{1,5}/)).toLocaleString();

// OVERDEVELOPMENT TIME
    var od = String(soarForecastData.contents.match(/(?<=PMENT.+\s|pment.+\s).{4}/));
    if (parseInt(od)) {
        var odFirst2 = parseInt(od.substr(0,2));
        var odAMPM = (odFirst2 > 11) ? " pm" : " am";
        odFirst2 = (odFirst2 > 12) ? odFirst2 -= 12 : odFirst2;
        od = String(odFirst2) + ":" + od.substr(2,4) + odAMPM;
    }

// SUNSET TIME
    var sunsetTimeSs = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}\sMDT\n)/));
    var sunsetTimeMn = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}\sMDT\n)/));
    var sunsetTimeHr = parseInt(soarForecastData.contents.match(/\d{2}(?=:\d{2}:\d{2}\sMDT\n)/)) - 12;
    if (sunsetTimeSs > 30) {
        sunsetTimeMn += 1;
        if (sunsetTimeMn == 60) {
            sunsetTimeMn = "00";
            sunsetTimeHr += 1;
        }
    }
    var sunsetTime = sunsetTimeHr + ":" + sunsetTimeMn + " pm";

// LIFTED CONDENSATION LEVEL
    var lcl = parseInt(soarForecastData.contents.match(/(?<=l\.{7})\s\d{4,5}/)).toLocaleString();

// K INDEX ARRAY
    var kIndex = soarForecastData.contents.match(/(?<=x\.{3}\s+).\d{1,3}\.\d/g);

// CAPE ARRAY
    var cape = soarForecastData.contents.match(/(?<=PE\.{3}\s+).\d{1,4}\.\d/g);

// LI (LIFTED INDEX) ARRAY
    var li = soarForecastData.contents.match(/(?<=LI\.{3}\s+).\d{1,3}\.\d/g);

    document.getElementById('soar-forecast-report-date').innerHTML = soarForecastReportFullDate;
    document.getElementById('max-rol').innerHTML = maxRateOfLift;
    document.getElementById('top-of-lift').innerHTML = topOfLift;
    document.getElementById('neg3-index').innerHTML = neg3Index;
    document.getElementById('lcl').innerHTML = lcl;
    document.getElementById('od-time').innerHTML = od;
    document.getElementById('sunset-time').innerHTML = sunsetTime;
    document.getElementById('kindex-9').innerHTML = kIndex[0];
    document.getElementById('kindex-12').innerHTML = kIndex[1];
    document.getElementById('kindex-3').innerHTML = kIndex[2];
    document.getElementById('kindex-6').innerHTML = kIndex[3];
    document.getElementById('cape-9').innerHTML = cape[0];
    document.getElementById('cape-12').innerHTML = cape[1];
    document.getElementById('cape-3').innerHTML = cape[2];
    document.getElementById('cape-6').innerHTML = cape[3];
    document.getElementById('li-9').innerHTML = li[0];
    document.getElementById('li-12').innerHTML = li[1];
    document.getElementById('li-3').innerHTML = li[2];
    document.getElementById('li-6').innerHTML = li[3];
});

// -----------------------------------
// -----------------------------------
// W I N D S   A L O F T   S C R A P E
// -----------------------------------
// -----------------------------------

// FORECAST TIMEFRAME (6, 12, OR 24 HR)
    var fcastRange = "12";
    if (hour >= 14 && hour <= 19) {
        fcastRange = "06";
    } else if (hour > 19 || hour <=3) {
        fcastRange = "24";
    }

var windAloftForecastURL = "https://www.aviationweather.gov/windtemp/data?level=low&fcst=" + fcastRange + "&region=slc&layout=on&date=";
$.getJSON(scrapeURLBase + encodeURIComponent(windAloftForecastURL) + '&callback=?', function(windAloftData) {

// FORECAST START TIME (ZULU)
    var fcastStartTime = parseInt(windAloftData.contents.match(/\d{2}(?=\d{2}-\d{4}Z)/)) - 6;
    var fcastStartTimeAMPM = " am", fcastEndTimeAMPM = " am";
    if (fcastStartTime == 12) {
        fcastStartTime = "Noon";
        fcastStartTimeAMPM = "";
    }
    if (fcastStartTime > 12) {
        fcastStartTime -= 12;
        fcastStartTimeAMPM = " pm";
    }
    fcastStartTime = fcastStartTime + fcastStartTimeAMPM;

// FORECAST END TIME (ZULU)
    var fcastEndTime = parseInt(windAloftData.contents.match(/\d{2}(?=\d{2}Z.\sTEMPS)/)) - 6;
    if (fcastEndTime == 0) {
        fcastEndTime = "Midnight";
        fcastEndTimeAMPM = "";
    }
    if (fcastEndTime < 0) {
        fcastEndTime += 12;
        fcastEndTimeAMPM = " pm";
    }
    fcastEndTime = fcastEndTime + fcastEndTimeAMPM;

// FORECAST DAY
    var fcastDay;
    fcastDay = (fcastRange == "24" && hour > 19) ? " (tomorrow)" : "";

// DIRECTION, SPEED, & TEMP ARRARYS (6K, 9K, 12K, 18K)
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

    document.getElementById('winds-aloft-forecast-start').innerHTML = fcastStartTime;
    document.getElementById('winds-aloft-forecast-end').innerHTML = fcastEndTime;
    document.getElementById('winds-aloft-forecast-day').innerHTML = fcastDay;
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

// ---------------------------------------------
// ---------------------------------------------
// S L C C   C A M   I M A G E   R O T A T I O N
// ---------------------------------------------
// ---------------------------------------------

/*function wasatchCamImgLoop() {
    
    function getPicURLArray() {
        var images = [], var timestamp = [];
        var mn = today.getMinutes();
        var hr = today.getHours() - 1; // First pic back an hour for loop
        
        //Force minutes to 11, 26, 41, or 56 (Img capture times)
        if (mn > 56) {
                mn = 41;
        }
        if (mn > 41 && mn < 56) {
                mn = 26;
        }
        if (mn > 26 && mn < 41) {
                mn = 11;
        }
        if (mn > 11 && mn < 26) {
                hr--;
                mn = 56;
        }
        if (mn < 11) {
                hr--;
                mn = 41;
        }
            
        //Load images array        
        hr = hr >= 10 ? hr : '0' + hr; //Force double-digit hours
        for (i = 0; i < 5; i++) {
            images[i] = "https://cameras-cam.cdn.weatherbug.net/SALTC/" + yyyy + '/' + mm + '/' + dd + '/' + mm + dd + yyyy + hr + mn + "_l.jpg";
            if (hr > 11) {                                                     //Convert to PM hours
                timestamp[i] = (hr - 12) + ":" + mn + " pm, " + month + " " + dd;
                if (hr == 12) {                                                 //Don't change 12 for PM hours start
                  timestamp[i] = hr + ":" + mn + " pm, " + month + " " + dd;
                }
            } else {
                timestamp[i] = (hr - 0) + ":" + mn + " am, " + month + " " + dd;   //Add AM to AM hours
                if (hr == 0) {
                  timestamp[i] = "12:" + mn + " am, " + month + " " + dd;          //Don't change 12 for AM hours start
                }
            }
            
            mn = mn + 15;                           //Increment minutes for next image
            if (mn == 71) {                         //If minutes > 60
                hr++;                               //Increment hour
                  if (hr == 24) {                   //If hours > 23
                    hr = 0;                         //Reset hours
                    dd++;                           //Incrment day
                    dd = dd >= 10 ? dd : '0' + dd;  //Re-force double-digit day
                  }
                hr = hr >= 10 ? hr : '0' + hr;      //Re-force double-digit hours
                mn = 11;                            //Start new minutes cycle
            }
        }
          
        images.push(images[4]);         //Append duplicate image at end of array for visual pause
        timestamp.push(timestamp[4]);   //Append duplicate timestamp at end or arrary for visual pause
        return [images, timestamp];
    }

  var rotator = document.getElementById('WasatchCam');
  var delay = 800;
  var [images, timestamp] = getPicURLArray();
  var loopCount = 0;
        
  var changeImage = function() {
      var length = images.length;
      rotator.src = images[loopCount];
      document.getElementById('picTimestamp').innerHTML = timestamp[loopCount];
      loopCount++;
      if (loopCount == length) {
        loopCount = 0;
      }
  };
setInterval(changeImage, delay); //Rotate images
};
wasatchCamImgLoop;*/