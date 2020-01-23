/////////////////////////////////////////////////////////////
// G L O B A L   C O N S T A N T S   &   V A R I A B L E S //
/////////////////////////////////////////////////////////////

const today = new Date();
const yyyy = today.getFullYear();
const monthName = today.toLocaleString('en-us', {month: 'short'});
const month2Digit = (today.getMonth() + 1 < 10) ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
const dayName = today.toLocaleDateString('en-us', {weekday: 'short'});
const dayNum = today.getDate();
const day2Digit = (dayNum < 10) ? "0" + dayNum : dayNum;
const dateToday = dayName + ", " + monthName + " " + dayNum;
const hour = today.getHours();
const timeOffset = 6;
const fcGraphicSwitchTime = (hour > 18 || hour < 7) ? 7 : 3;
const soarFcURL = "https://www.weather.gov/source/slc/aviation/files/SLCSRGSLC0.txt";
const noaaFcURL = "https://forecast.weather.gov/MapClick.php?lat=40.76031000000006&lon=-111.88821999999999#.XNmCho5KhPY";
const noaaImgURL = "https://forecast.weather.gov/";
const scrapeURL = "https://whatever-origin.herokuapp.com/get?url=";

document.getElementById('date-today').innerHTML = dateToday;
document.getElementById('surface-wind-image').src = "https://graphical.weather.gov/images/slc/WindSpd" + fcGraphicSwitchTime + "_slc.png";
document.getElementById('weather-image').src = "https://graphical.weather.gov/images/slc/Wx" + fcGraphicSwitchTime + "_slc.png";
document.getElementById('skewT').src = "https://climate.cod.edu/data/raob/KSLC/skewt/KSLC.skewt." + yyyy + month2Digit + day2Digit + ".12.gif";

// WIND STATIONS
// DATA VIA KEYED API
$.get("https://api.mesowest.net/v2/station/timeseries?&stid=OGP&stid=MSI01&stid=C8948&stid=PKC&stid=FPS&stid=FPN&stid=KSLC&stid=KU42&recent=90&obtimezone=local&timeformat=%-I:%M%20%p&vars=wind_speed,wind_gust,wind_direction,altimeter,air_temp&units=english,speed|mph,temp|F&token=6243aadc536049fc9329c17ff2f88db3", function(stationData) {
    // MESONET TIME SERIES INFO PAGE: https://developers.synopticdata.com/mesonet/v2/stations/timeseries
    let stationCount = stationData.STATION.length,
        stationLatestReadingPosition = [],
        stationTime = [], windSpeed = [], windGust = [], windDirImg = [];

    // MOST RECENT READING POSITION FOR EACH STATION
    for (i=0; i<stationCount; i++) {
        stationLatestReadingPosition[i] = stationData.STATION[i].OBSERVATIONS.date_time.length - 1;
    }

    // MOST RECENT PRESSURE & TEMP @ KSLC
    if (stationData.STATION[0].STID == "KSLC") {
        pressure = stationData.STATION[0].OBSERVATIONS.altimeter_set_1[stationLatestReadingPosition[0]].toFixed(2);
        temp = Math.round(stationData.STATION[0].OBSERVATIONS.air_temp_set_1[stationLatestReadingPosition[0]]);
    } else {pressure = temp = "No Data";}

    // MOST RECENT READINGS: TIME, WIND, GUST, DIRECTION
    for (i=0; i<stationCount; i++) {
        stationTime[i] = stationData.STATION[i].OBSERVATIONS.date_time[stationLatestReadingPosition[i]].toLowerCase();
        windSpeed[i] = Math.round(stationData.STATION[i].OBSERVATIONS.wind_speed_set_1[stationLatestReadingPosition[i]]);
        windSpeed[i] = (windSpeed[i] > 0) ? windSpeed[i] : "<p class='txtsz50'>Calm</p>";
        try {
            windGust[i] = Math.round(stationData.STATION[i].OBSERVATIONS.wind_gust_set_1[stationLatestReadingPosition[i]]);
            windGust[i] = (windGust[i] > 0) ? windGust[i] : "";
        } catch(err) { windGust[i] = ""; }
        try {
            windDirImg[i] = Math.round(stationData.STATION[i].OBSERVATIONS.wind_direction_set_1[stationLatestReadingPosition[i]] / 10) * 10;
            windDirImg[i] = (windDirImg[i] < 100) ? windDirImg[i] = "0" + windDirImg[i] : windDirImg[i];
            windDirImg[i] = (isNaN(windSpeed[i])) ? "calm" : windDirImg[i];
            windDirImg[i] = "images/winddirimages/d" + windDirImg[i] + ".gif";
        } catch(err) { windDirImg[i] = "images/winddirimages/nodata.gif"; }
    }

    // GET ELEMENT BY ID
    document.getElementById('pressure').innerHTML = pressure;
    document.getElementById('temp').innerHTML = temp;
    for (i=0; i<stationCount; i++) {
        document.getElementById(stationData.STATION[i].STID + '-time').innerHTML = stationTime[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-speed').innerHTML = windSpeed[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-gust').innerHTML = windGust[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-dir-img').src = windDirImg[i];
    }
});

// SUNSET TIME
// DATA VIA OPEN API
$.get("https://api.sunrise-sunset.org/json?lat=40.789900&lng=-111.979100&date=today&formatted=0", function(slcSolarData) {
    let sunsetSLC = new Date(slcSolarData.results.sunset);
    let sunsetSLCMins = sunsetSLC.getMinutes();
    sunsetSLCMins = (sunsetSLCMins < 10) ? "0" + sunsetSLCMins : sunsetSLCMins;
    sunsetSLC = sunsetSLC.getHours() - 12 + ":" + sunsetSLCMins;
    document.getElementById('sunset-time').innerHTML = sunsetSLC;
});

// WIND ALOFT
// DATA VIA GAE PYTHON FTP
// $.get("https://wind-aloft-forecast.appspot.com", function(waloftFcDataGAE) {
$.get("https://us-central1-wasatchwind.cloudfunctions.net/wind-aloft", function(waloftFcDataGAE) {
    console.log(waloftFcDataGAE);
    document.getElementById('wind-aloft-fc-start').innerHTML = waloftFcDataGAE.HEADER.START_TIME;
    document.getElementById('wind-aloft-fc-end').innerHTML = waloftFcDataGAE.HEADER.END_TIME;
    document.getElementById('wind-aloft-fc-day').innerHTML = waloftFcDataGAE.HEADER.FORECAST_DAY;
    document.getElementById('wind-aloft-0-spd').innerHTML = waloftFcDataGAE.DATA[0].SPD; //6k no tmp
    document.getElementById('wind-aloft-0-dir').src = waloftFcDataGAE.DATA[0].DIR; //6k no tmp
    for (i=1; i<4; i++) { //9k, 12k, and 18k loop
        document.getElementById('wind-aloft-' + i + '-spd').innerHTML = waloftFcDataGAE.DATA[i].SPD;
        document.getElementById('wind-aloft-' + i + '-dir').src = waloftFcDataGAE.DATA[i].DIR;
        document.getElementById('wind-aloft-' + i + '-tmp').innerHTML = waloftFcDataGAE.DATA[i].TMP;
    }
});

// // WIND ALOFT
// // DATA VIA CLIENT-SIDE WHATEVER ORIGIN SCRAPE (CORS HACK)

// // DETERMINE WHICH FORECAST URL TO USE (6, 12, OR 24 HOUR)
// var wAloftFcRange = "1";
// wAloftFcRange = (hour > 3 && hour < 13) ? wAloftFcRange = "3" : (hour > 18 || hour < 4) ? wAloftFcRange = "5" : wAloftFcRange;
// var wAloftFcURL = "https://forecast.weather.gov/product.php?site=CRH&issuedby=US" + wAloftFcRange + "&product=FD" + wAloftFcRange + "&format=txt&version=1&glossary=0";

// $.getJSON(scrapeURL + encodeURIComponent(wAloftFcURL) + '&callback=?', function(wAloftFcData) {
//     // FORECAST START TIME, END TIME (ZULU), & DAY; CONVERT TO MOUNTAIN TIME (timeOffset)
//     let fcStartTime = parseInt(String(wAloftFcData.contents.match(/[Uu][Ss][Ee]\s\d{2}/)).substr(4)) - timeOffset;
//     fcStartTime = (fcStartTime == 12) ? fcStartTime = "Noon" : (fcStartTime > 12) ? String(fcStartTime -= 12) + " pm" : fcStartTime;
//     let fcEndTime = parseInt(String(wAloftFcData.contents.match(/-\d{4}Z/)).substr(1,2)) - timeOffset;
//     fcEndTime = (fcEndTime == 0) ? fcEndTime = "Midnight" : (fcEndTime < 0) ? String(fcEndTime += 12) + " pm" : fcEndTime;
//     fcDay = (wAloftFcRange == "5" && hour > 18) ? " (tomorrow)" : "";

//     // DIRECTION, SPEED, & TEMP ARRARYS (6K, 9K, 12K, 18K)
//     let slcLine = String(wAloftFcData.contents.match(/SLC.+/)).substr(9,31);
//     let wAloftDirs = [], wAloftSpds = [], wAloftTmps = [];
//     for (i=0; i<4; i++) {
//         wAloftDirs[i] = slcLine.substr(i*8,2);
//         wAloftDirs[i] = (wAloftDirs[i] == 99) ? "calm" : (wAloftDirs[i] * 10 < 100) ? "0" + wAloftDirs[i] * 10 : wAloftDirs[i] * 10;
//         wAloftDirs[i] = "images/winddirimages/d" + wAloftDirs[i] + ".gif";
//         wAloftSpds[i] = Math.round(parseFloat(slcLine.substr(i*8+2,2) * 1.15078));
//         wAloftSpds[i] = (wAloftSpds[i] == 0) ? "" : wAloftSpds[i];
//         wAloftTmps[i] = parseInt(slcLine.substr(i*8+5,2));
//         wAloftTmps[i] = (slcLine.substr(i*8+4,1) == "-") ? Math.round(wAloftTmps[i] * (-9/5) + 32) : Math.round(wAloftTmps[i] * (9/5) + 32);
//     }
//     wAloftTmps[0] = ""; // No temp at 6k

//     // GET ELEMENT BY ID
//     document.getElementById('wind-aloft-fc-start').innerHTML = fcStartTime;
//     document.getElementById('wind-aloft-fc-end').innerHTML = fcEndTime;
//     document.getElementById('wind-aloft-fc-day').innerHTML = fcDay;
//     for (i=0; i<4; i++) {
//         document.getElementById('wind-aloft-' + i + '-spd').innerHTML = wAloftSpds[i];
//         document.getElementById('wind-aloft-' + i + '-dir').src = wAloftDirs[i];
//         document.getElementById('wind-aloft-' + i + '-tmp').innerHTML = wAloftTmps[i];
//     }
// });


// SOARING FORECAST
// DATA VIA GAE PYTHON SCRAPE
$.get("https://soaring-forecast.appspot.com", function(soarFcDataGAE) {
    soarFcDate = soarFcDataGAE.BASIC.REPORT_DATE;
    soarFcDate = (soarFcDate == dateToday) ? soarFcDate : "Outdated Report !";
    maxRateOfLift = soarFcDataGAE.BASIC.MAX_RATE_OF_LIFT;
    neg3Index = soarFcDataGAE.BASIC.NEG_3_INDEX;
    topOfLift = soarFcDataGAE.BASIC.TOP_OF_LIFT;

    let maxRateOfLiftms = Math.round((maxRateOfLift / 196.85) * 10) / 10 + " m/s";
    let neg3Indexm = Math.round(neg3Index / 3.281) + " m";
    let topOfLiftm = Math.round(topOfLift / 3.281) + " m";

    if (soarFcDate == "Outdated Report !") {
        maxRateOfLift = neg3Index = topOfLift = "No Data";
        maxRateOfLiftms = neg3Indexm = topOfLiftm = "";
    }

    document.getElementById('soar-forecast-date').innerHTML = soarFcDate;
    document.getElementById('max-rol').innerHTML = parseInt(maxRateOfLift).toLocaleString();
    document.getElementById('max-rol-ms').innerHTML = maxRateOfLiftms;
    document.getElementById('neg3-index').innerHTML = parseInt(neg3Index).toLocaleString();
    document.getElementById('neg3-index-m').innerHTML = neg3Indexm;
    document.getElementById('top-of-lift').innerHTML = parseInt(topOfLift).toLocaleString();
    document.getElementById('top-of-lift-m').innerHTML = topOfLiftm;

    // FULL(SUMMER) REPORT
    // cloudbaseLCL = soarFcDataGAE.FULL.CLOUDBASE_LCL;
    // let cloudbaseLCLm = Math.round(cloudbaseLCL / 3.281) + " m";
    // odTime = soarFcDataGAE.FULL.OD_TIME;

    // document.getElementById('cloudbase-lcl').innerHTML = parseInt(cloudbaseLCL).toLocaleString();
    // document.getElementById('cloudbase-lcl-m').innerHTML = cloudbaseLCLm;
    // document.getElementById('od-time').innerHTML = odTime;

    // for (i=0; i<4; i++) {
    //     document.getElementById('kindex-' + [i]).innerHTML = soarFcDataGAE.FULL[i].K_NDX;
    //     document.getElementById('cape-' + [i]).innerHTML = soarFcDataGAE.FULL[i].CAPE;
    //     document.getElementById('li-' + [i]).innerHTML = soarFcDataGAE.FULL[i].LI;
    // }
});

// // WINTER FORMAT, CLIENT DIRECT SCRAPE CORS BYPASS
// $.getJSON(scrapeURL + encodeURIComponent(soarFcURL) + '&callback=?', function(soarFcData) {
// // REPORT DATE
//     let soarFcDate = new Date(soarFcData.contents.match(/\d{2}[\/]\d{2}[\/]\d{2}/));
//     let soarFcWkDay = soarFcDate.toLocaleDateString('en-us', {weekday: 'short'});
//     let soarFcMonth = soarFcDate.toLocaleString('en-us', {month: 'short'});
//     soarFcDate = soarFcWkDay + ", " + soarFcMonth + " " + soarFcDate.getDate();
//     soarFcDate = (soarFcDate == dateToday) ? soarFcDate : "Outdated Report !";

// // MAX RATE OF LIFT (FT/MIN & M/S)
//     let maxRateOfLift = parseInt(soarFcData.contents.match(/\d{1,3}\s[Ff][Tt][\/]/));
//     let maxRateOfLiftms = Math.round((maxRateOfLift / 196.85) * 10) / 10 + " m/s";
    
// // HEIGHT OF -3 INDEX (FT & M)
//     let neg3Index = parseInt(String(soarFcData.contents.match(/[Xx]\.{4}\s\d{4,5}/)).substr(6));
//     let neg3Indexm = Math.round(neg3Index / 3.281) + " m";
//     neg3Index = (isNaN(neg3Index)) ? "None" : neg3Index.toLocaleString();

// // TOP OF LIFT (FT & M)
//     let topOfLift = parseInt(String(soarFcData.contents.match(/[Tt]\.{11}\s\d{4,5}/)).substr(13));
//     let topOfLiftm = Math.round(topOfLift / 3.281) + " m";
//     topOfLift = (isNaN(topOfLift)) ? "None" : topOfLift.toLocaleString();

// // IF OUTDATED REPORT CLEAR VARIABLES
//     if (soarFcDate == "Outdated Report !") {
//         maxRateOfLift = neg3Index = topOfLift = "No Data";
//         maxRateOfLiftms = neg3Indexm = topOfLiftm = "";
//     }

// // GET ELEMENT BY ID
//     document.getElementById('soar-forecast-date').innerHTML = soarFcDate;
//     document.getElementById('max-rol').innerHTML = maxRateOfLift;
//     document.getElementById('max-rol-ms').innerHTML = maxRateOfLiftms;
//     document.getElementById('neg3-index').innerHTML = neg3Index;
//     document.getElementById('neg3-index-m').innerHTML = neg3Indexm;
//     document.getElementById('top-of-lift').innerHTML = topOfLift;
//     document.getElementById('top-of-lift-m').innerHTML = topOfLiftm;
// });

///////////////////////////////////////////////// 
// N O A A   F O R E C A S T   ( S C R A P E ) //
/////////////////////////////////////////////////

$.getJSON(scrapeURL + encodeURIComponent(noaaFcURL) + '&callback=?', function(noaaFcData) {
// 72 HOUR FORECAST
    noaaFcImg = noaaFcData.contents.match(/[Dn].+(?="\salt=".+y:)/g);
    noaaFcDay = noaaFcData.contents.match(/e=".+[^tn](?=:\s[A-Z])/g);
    noaaFcTxt = noaaFcData.contents.match(/[^tn]:\s[A-Z].+(?="\stitle)/g);
    for (i=0; i<3; i++) {
        document.getElementById('forecast-day' + i +'-img').src = noaaImgURL + noaaFcImg[i];
        document.getElementById('forecast-day' + i +'-day').innerHTML = noaaFcDay[i].substr(3);
        document.getElementById('forecast-day' + i +'-txt').innerHTML = noaaFcTxt[i].substr(3);
    }
});

/////////////////////////////////////////////////////
// B U T T O N   E X P A N D   &   C O L L A P S E //
/////////////////////////////////////////////////////

let btnCollapse = document.getElementsByClassName("collapsible");
for (i=0; i<btnCollapse.length; i++) {
    btnCollapse[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let btnDraw = this.nextElementSibling;
        if (btnDraw.style.maxHeight) {
            btnDraw.style.maxHeight = null;
        } else {
            btnDraw.style.maxHeight = btnDraw.scrollHeight + "px";
        }
    });
}
