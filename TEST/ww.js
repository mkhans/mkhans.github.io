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

//--------------------------------------
//--------------------------------------
// H T M L   F U N C T I O N   C A L L S
//--------------------------------------
//--------------------------------------

$(document).ready (function todayFullDate() {
    document.getElementById('today-full-date').innerHTML = dayName + ", " + monthName + " " + dayNum;
});

$(document).ready (function slcRecentURL() {
    document.getElementById('slc-recent').src = "https://www.wunderground.com/cgi-bin/histGraphAll?day=" + day2Digit + "&year=" + yyyy + "&month=" + monthNum + "&ID=KSLC&type=3&width=614";
});

$(document).ready (function getSkewTURL() {
    document.getElementById('skewT').src = "https://climate.cod.edu/data/raob/KSLC/skewt/KSLC.skewt." + yyyy + month2Digit + day2Digit + ".12.gif";
});

// -----------------------------
// -----------------------------
// S U N S E T   T I M E   A P I
// -----------------------------
// -----------------------------

var xhrGetSunsetSLC = new XMLHttpRequest();
xhrGetSunsetSLC.open('GET', 'https://api.sunrise-sunset.org/json?lat=40.789900&lng=-111.979100&date=today&formatted=0', true);
xhrGetSunsetSLC.responseType = 'text';
xhrGetSunsetSLC.send();
$(document).ready (function () {
    var solarData = JSON.parse(xhrGetSunsetSLC.responseText);
    var jsonSunset = solarData.results.sunset;
    var sunsetSLC = new Date(jsonSunset);
    sunsetSLC = sunsetSLC.getHours() - 12 + ":" + sunsetSLC.getMinutes() + " pm";
    document.getElementById('sunset-time').innerHTML = sunsetSLC;
});

// -------------------------------------------------------
// -------------------------------------------------------
// W I N D   S T A T I O N   T I M E   S E R I E S   A P I
// -------------------------------------------------------
// -------------------------------------------------------

var xhrTimeSeries = new XMLHttpRequest();
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=OGP&stid=MSI01&stid=C8948&stid=PKC&stid=FPS&stid=FPN&stid=KSLC&stid=KU42&recent=90&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
var weatherData = JSON.parse(xhrTimeSeries.responseText);
var stationsCount = weatherData.STATION.length;
var stationObservationsCount = [], stationName = [], stationHour = [], stationAMPM = [], stationMins = [], latestTimes = [], windSpeeds = [], windGusts = [], windDirImgs = [];

// MOST RECENT READING FOR EACH STATION
for (i=0; i<stationsCount; i++) {
    stationObservationsCount[i] = weatherData.STATION[i].OBSERVATIONS.date_time.length - 1;
}

// STATION NAMES
for (i=0; i<stationsCount; i++) {
    try {
        stationName[i] = weatherData.STATION[i].STID;
        stationName[i] = (stationName[i] == "OGP") ? "Ogden Peak" : stationName[i];
        stationName[i] = (stationName[i] == "PKC") ? "Jupiter" : stationName[i];
        stationName[i] = (stationName[i] == "MSI01") ? "Olympus MSI" : stationName[i];
        stationName[i] = (stationName[i] == "C8948") ? "Centerville" : stationName[i];
        stationName[i] = (stationName[i] == "FPS") ? "Southside" : stationName[i];
        stationName[i] = (stationName[i] == "FPN") ? "Northside" : stationName[i];
        stationName[i] = (stationName[i] == "KU42") ? "Airport 2" : stationName[i];
    }
    catch(err) {
        stationName[i] = "---";
    }
}

// MOST RECENT TIME
for (i=0; i<stationsCount; i++) {
    try {
        stationHour[i] = parseInt(weatherData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(9,2));
        stationAMPM[i] = " am";
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
        stationMins[i] = weatherData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(12, 2);
        latestTimes[i] = stationHour[i] + ":" + stationMins[i] + stationAMPM[i];
    }
    catch(err) {
        latestTimes[i] = "---";
    }
}

// ROUND & LOAD WIND SPEED & GUST, "---" IF NULL OR NO DATA
for (i=0; i<stationsCount; i++) {
    try {
        windSpeeds[i] = weatherData.STATION[i].OBSERVATIONS.wind_speed_set_1[stationObservationsCount[i]];
        windSpeeds[i] = (parseInt(windSpeeds[i]) > 0) ? windSpeeds[i] = Math.round(windSpeeds[i]) : "<span class='calm'>Calm</span>";
    }
    catch(err) {
        windSpeeds[i] = "No Data";
    }
    
    try {
        windGusts[i] = weatherData.STATION[i].OBSERVATIONS.wind_gust_set_1[stationObservationsCount[i]];
        windGusts[i] = (parseInt(windGusts[i]) > 0) ? windGusts[i] = Math.round(windGusts[i]) : "---";
    }
    catch(err) {
        windGusts[i] = "";
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
        windDirImgs[i] = "https://www.usairnet.com/weather/winds_aloft/nodata.gif";
    }
}

// GET ELEMENT BY ID
if (stationName[1] != undefined) {
    document.getElementById('station0-name').innerHTML = stationName[0];
    document.getElementById('station0-time').innerHTML = latestTimes[0];
    document.getElementById('station0-wind-speed').innerHTML = windSpeeds[0];
    document.getElementById('station0-wind-gust').innerHTML = windGusts[0];
    document.getElementById('station0-wind-dir-img').src = windDirImgs[0];
}

if (stationName[1] != undefined) {
    document.getElementById('station1-name').innerHTML = stationName[1];
    document.getElementById('station1-time').innerHTML = latestTimes[1];
    document.getElementById('station1-wind-speed').innerHTML = windSpeeds[1];
    document.getElementById('station1-wind-gust').innerHTML = windGusts[1];
    document.getElementById('station1-wind-dir-img').src = windDirImgs[1];
}

if (stationName[2] != undefined) {
    document.getElementById('station2-name').innerHTML = stationName[2];
    document.getElementById('station2-time').innerHTML = latestTimes[02];
    document.getElementById('station2-wind-speed').innerHTML = windSpeeds[2];
    document.getElementById('station2-wind-gust').innerHTML = windGusts[2];
    document.getElementById('station2-wind-dir-img').src = windDirImgs[2];
}

if (stationName[3] != undefined) {
    document.getElementById('station3-name').innerHTML = stationName[3];
    document.getElementById('station3-time').innerHTML = latestTimes[3];
    document.getElementById('station3-wind-speed').innerHTML = windSpeeds[3];
    document.getElementById('station3-wind-gust').innerHTML = windGusts[3];
    document.getElementById('station3-wind-dir-img').src = windDirImgs[3];
}

if (stationName[4] != undefined) {
    document.getElementById('station4-name').innerHTML = stationName[4];
    document.getElementById('station4-time').innerHTML = latestTimes[4];
    document.getElementById('station4-wind-speed').innerHTML = windSpeeds[4];
    document.getElementById('station4-wind-gust').innerHTML = windGusts[4];
    document.getElementById('station4-wind-dir-img').src = windDirImgs[4];
}

if (stationName[5] != undefined) {
    document.getElementById('station5-name').innerHTML = stationName[5];
    document.getElementById('station5-time').innerHTML = latestTimes[5];
    document.getElementById('station5-wind-speed').innerHTML = windSpeeds[5];
    document.getElementById('station5-wind-gust').innerHTML = windGusts[5];
    document.getElementById('station5-wind-dir-img').src = windDirImgs[5];
}

if (stationName[6] != undefined) {
    document.getElementById('station6-name').innerHTML = stationName[6];
    document.getElementById('station6-time').innerHTML = latestTimes[6];
    document.getElementById('station6-wind-speed').innerHTML = windSpeeds[6];
    document.getElementById('station6-wind-gust').innerHTML = windGusts[6];
    document.getElementById('station6-wind-dir-img').src = windDirImgs[6];
}

if (stationName[7] != undefined) {
    document.getElementById('station7-name').innerHTML = stationName[7];
    document.getElementById('station7-time').innerHTML = latestTimes[7];
    document.getElementById('station7-wind-speed').innerHTML = windSpeeds[7];
    document.getElementById('station7-wind-gust').innerHTML = windGusts[7];
    document.getElementById('station7-wind-dir-img').src = windDirImgs[7];
}
}

// ---------------------------------------------------------
// ---------------------------------------------------------
// N O A A   S T A N D A R D   F O R E C A S T   S C R A P E
// ---------------------------------------------------------
// ---------------------------------------------------------

var noaaForecastURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
$.getJSON(scrapeURLBase + encodeURIComponent(noaaForecastURL) + '&callback=?', function(noaaForecastData) {

// CURRENT WEATHER IMAGE
var noaaCurrentImg = noaaImgURLBase + noaaForecastData.contents.match(/newimages\/large\/.+(?="\salt)/);

// SKY COVER
var noaaCurrentSky = String(noaaForecastData.contents.match(/ent">.+(?=<\Sp>)/)).substr(5);

// TEMP (CURRENT & NEXT)
var noaaCurrentTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=&deg;F<)/));
var noaaNextTemp = String(noaaForecastData.contents.match(/\d{1,3}(?=\s&deg)/));
var tempColor = "orangered";
tempColor = (noaaNextTemp > noaaCurrentTemp) ? tempColor : "lightblue";
noaaCurrentTemp = noaaCurrentTemp + "<span style='font-size:50%; color:" + tempColor + ";'>&nbsp;&nbsp;&nbsp;--> " + noaaNextTemp + "</span>";

// PRESSURE
var noaaCurrentPres = String(noaaForecastData.contents.match(/\d{1,2}\.\d{1,2}(?=\sin)/));

// SHORT TERM FORECAST
var noaaShortImg = noaaImgURLBase + noaaForecastData.contents.match(/DualImage.+(?="\salt="[A-Z])|newimages\/m.+(?="\salt="[A-Z])/);
var noaaShortTime = String(noaaForecastData.contents.match(/name">[A-Z][a-z]+/)).substr(6);
noaaShortTime = (noaaShortTime == "This") ? "This Afternoon" : noaaShortTime;
var noaaShortText = String(noaaForecastData.contents.match(/:\s[A-Z].+(?="\stitle)/)).substr(2);

// 72 HOUR FORECAST
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var tomorrow = today.getDay() + 1;
var forecastRegex = new RegExp;
var forecastDays = [], forecastImgs = [], forecastTexts = [];
for (i=0; i<3; i++) {
    tomorrow = (tomorrow + i < 7) ? tomorrow : tomorrow - 7;
    forecastDays[i] = weekdays[tomorrow + i];
    forecastRegex = '".+(?=".alt="' + weekdays[tomorrow + i] + ':)';
    forecastImgs[i] = noaaImgURLBase + String(noaaForecastData.contents.match(forecastRegex)).substr(1);
    forecastRegex = ':.+(?=".title="' + weekdays[tomorrow + i] + ':)';
    forecastTexts[i] = String(noaaForecastData.contents.match(forecastRegex)).substr(2);
}

// GET ELEMENT BY ID
document.getElementById('noaa-current-img').src = noaaCurrentImg;
document.getElementById('noaa-current-sky').innerHTML = noaaCurrentSky;
document.getElementById('noaa-current-temp').innerHTML = noaaCurrentTemp;
document.getElementById('noaa-current-pres').innerHTML = noaaCurrentPres;
document.getElementById('noaa-short-img').src = noaaShortImg;
document.getElementById('noaa-short-time').innerHTML = noaaShortTime;
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

// ---------------------------------------------
// ---------------------------------------------
// S O A R I N G   F O R E C A S T   S C R A P E
// ---------------------------------------------
// ---------------------------------------------

var soaringForecastURL = "https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt";
$.getJSON(scrapeURLBase + encodeURIComponent(soaringForecastURL) + '&callback=?', function(soarForecastData) {

// REPORT DATE
var soarForecastReportWkDay = String(soarForecastData.contents.match(/MDT\s[A-Z][a-zA-Z]{2}/)).substr(4);
soarForecastReportWkDay = soarForecastReportWkDay.substr(0,1) + soarForecastReportWkDay.substr(1).toLowerCase();
var soarForecastReportMonth = String(soarForecastData.contents.match(/[Dd][Aa][Yy],\s[a-zA-Z]{3}/)).substr(5);
soarForecastReportMonth = soarForecastReportMonth.substr(0,1) + soarForecastReportMonth.substr(1).toLocaleLowerCase();
var soarForecastReportDate = String(soarForecastData.contents.match(/\d{1,2}(?=,\s2019)/));
var soarForecastReportFullDate = soarForecastReportWkDay + ", " + soarForecastReportMonth + " " + soarForecastReportDate;
soarForecastReportFullDate = (soarForecastReportFullDate == dayName + ", " + monthName + " " + dayNum) ? soarForecastReportFullDate = soarForecastReportFullDate : soarForecastReportFullDate + "<br><br><b>! ! !<br>- Report DATE Error -</b>";

// MAX RATE OF LIFT
var maxRateOfLift = parseInt(soarForecastData.contents.match(/\d{1,4}.+[\/][Mm]/));
var maxRateOfLiftms = Math.round((maxRateOfLift / 196.85) * 10) / 10;
maxRateOfLift = maxRateOfLift.toLocaleString() + "<span style='font-size:30%; color:white;'>&nbsp;&nbsp;&nbsp;" + maxRateOfLiftms + " m/s</span>";

// HEIGHT OF THE -3 INDEX
var neg3Index = parseInt(String(soarForecastData.contents.match(/[Dd][Ee][Xx].+\d{1,5}.+[Mm]/)).substr(21));
neg3Index = (isNaN(neg3Index)) ? "None" : neg3Index;
var neg3Indexm = Math.round(neg3Index / 3.281);
neg3Indexm = (isNaN(neg3Indexm)) ? "" : String(neg3Indexm) + " m";
neg3Index = neg3Index.toLocaleString() + "<span style='font-size:30%; color:white;'>&nbsp;&nbsp;&nbsp;" + neg3Indexm + "</span>";

// LIFTED CONDENSATION LEVEL (CLOUDBASE)
var lcl = parseInt(String(soarForecastData.contents.match(/[Dd]\s[Cc][a-zA-Z]{11}.+\d{1,5}.+\(/)).substr(28));
var lclm = Math.round(lcl / 3.281);
lcl = lcl.toLocaleString() + "<span style='font-size:30%; color:white;'>&nbsp;&nbsp;&nbsp;" + lclm + " m</span>";

// TOP OF LIFT
var topOfLift = parseInt(String(soarForecastData.contents.match(/[Mm][Aa][Ll][Ss].+\d{1,5}.+\(/)).substr(23));
var topOfLiftm = Math.round(topOfLift / 3.281);
topOfLift = topOfLift.toLocaleString() + "<span style='font-size:30%; color:white;'>&nbsp;&nbsp;&nbsp;" + topOfLiftm + " m</span>";

// OVERDEVELOPMENT TIME
var od = String(soarForecastData.contents.match(/[Mm][Ee][Nn][Tt].+\d{4}|[Mm][Ee][Nn][Tt].+[A-Z][a-zA-Z]{3}/)).substr(29);
if (parseInt(od)) {
    var odFirst2 = parseInt(od.substr(0,2));
    var odAMPM = (odFirst2 > 11) ? " pm" : " am";
    odFirst2 = (odFirst2 > 12) ? odFirst2 -= 12 : odFirst2;
    od = String(odFirst2) + ":" + od.substr(2,4) + odAMPM;
}

// K INDEX ARRAY
var kIndex = soarForecastData.contents.match(/[Xx]\.{3}\s+.\d{1,4}\.\d/g);

// CAPE ARRAY
var cape = soarForecastData.contents.match(/E\.{3}\s+.\d{1,4}\.\d/g);

// LI (LIFTED INDEX) ARRAY
var li = soarForecastData.contents.match(/I\.{3}\s+.\d{1,4}\.\d/g);

document.getElementById('soar-forecast-report-date').innerHTML = soarForecastReportFullDate;
document.getElementById('max-rol').innerHTML = maxRateOfLift;
document.getElementById('top-of-lift').innerHTML = topOfLift;
document.getElementById('neg3-index').innerHTML = neg3Index;
document.getElementById('lcl').innerHTML = lcl;
document.getElementById('od-time').innerHTML = od;
document.getElementById('kindex-9').innerHTML = kIndex[0].substr(5);
document.getElementById('kindex-12').innerHTML = kIndex[1].substr(5);
document.getElementById('kindex-3').innerHTML = kIndex[2].substr(5);
document.getElementById('kindex-6').innerHTML = kIndex[3].substr(5);
document.getElementById('cape-9').innerHTML = cape[0].substr(6);
document.getElementById('cape-12').innerHTML = cape[1].substr(6);
document.getElementById('cape-3').innerHTML = cape[2].substr(6);
document.getElementById('cape-6').innerHTML = cape[3].substr(6);
document.getElementById('li-9').innerHTML = li[0].substr(11);
document.getElementById('li-12').innerHTML = li[1].substr(11);
document.getElementById('li-3').innerHTML = li[2].substr(11);
document.getElementById('li-6').innerHTML = li[3].substr(11);
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
var slcLine = String(windAloftData.contents.match(/SLC.+(?=\s\d{4}-)/)).substr(9);
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
        windAloftSpds[i] = "---";
    }
    
    windAloftTmps[i] = parseInt(slcLine.substr(i*8+5,2));
    if (slcLine.substr(i*8+4,1) == "-") {
        windAloftTmps[i] = windAloftTmps[i] * -1;
    }
    windAloftTmps[i] = (Number.isInteger(windAloftTmps[i])) ? Math.round(windAloftTmps[i] * (9/5) + 32) : "---";
}

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