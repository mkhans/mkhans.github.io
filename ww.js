// GLOBAL CONSTANTS
const today = new Date();
const displayDate = today.toLocaleString('en-us', {weekday: 'short', month: 'short', day: 'numeric'});
const yyyy = today.getFullYear();
const month2Digit = today.toLocaleString('en-us', {month: '2-digit'});
const day2Digit = today.toLocaleString('en-us', {day: '2-digit'});
const hour = today.getHours();
const fcGraphicSwitchTime = (hour > 18 || hour < 7) ? 7 : 3;

// SINGLE-LINE ELEMENTS
document.getElementById('date-today').innerHTML = displayDate;
document.getElementById('graphical-wind').src = "https://graphical.weather.gov/images/slc/WindSpd" + fcGraphicSwitchTime + "_slc.png";
document.getElementById('graphical-weather').src = "https://graphical.weather.gov/images/slc/Wx" + fcGraphicSwitchTime + "_slc.png";
document.getElementById('skewT').src = "https://climate.cod.edu/data/raob/KSLC/skewt/KSLC.skewt." + yyyy + month2Digit + day2Digit + ".12.gif";

// BUTTON EXPAND & COLLAPSE
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

// SUNSET TIME (OPEN API)
$.get("https://api.sunrise-sunset.org/json?lat=40.789900&lng=-111.979100&date=today&formatted=0", function(slcSolarData) {
    let sunsetSLC = new Date(slcSolarData.results.sunset);
    sunsetSLC = sunsetSLC.toLocaleString([], { hour12: true}).slice(10,15);
    document.getElementById('sunset-time').innerHTML = sunsetSLC;
});

// WIND STATIONS (KEY API)
$.get("https://api.mesowest.net/v2/station/timeseries?&stid=OGP&stid=UTOLY&stid=C8948&stid=PKC&stid=FPS&stid=KSLC&stid=KU42&recent=90&obtimezone=local&timeformat=%-I:%M%20%p&vars=wind_speed,wind_gust,wind_direction,altimeter,air_temp&units=english,speed|mph,temp|F&token=6243aadc536049fc9329c17ff2f88db3", function(stationData) {
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

    // MOST RECENT READINGS FOR EACH STATION: TIME, WIND, GUST, DIRECTION
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

// WIND ALOFT (GOOGLE CLOUD FUNCTION, PYTHON FTP)
$.get("https://us-central1-wasatchwind.cloudfunctions.net/wind-aloft-ftp", function(waloftFcData) {
    document.getElementById('wind-aloft-fc-start').innerHTML = waloftFcData.HEADER.START_TIME;
    document.getElementById('wind-aloft-fc-end').innerHTML = waloftFcData.HEADER.END_TIME;
    document.getElementById('wind-aloft-fc-day').innerHTML = waloftFcData.HEADER.FORECAST_DAY;
    document.getElementById('wind-aloft-0-spd').innerHTML = waloftFcData.DATA[0].SPD; //6k no tmp
    document.getElementById('wind-aloft-0-dir').src = waloftFcData.DATA[0].DIR; //6k no tmp
    for (i=1; i<4; i++) { //9k, 12k, and 18k loop
        document.getElementById('wind-aloft-' + i + '-spd').innerHTML = waloftFcData.DATA[i].SPD;
        document.getElementById('wind-aloft-' + i + '-dir').src = waloftFcData.DATA[i].DIR;
        document.getElementById('wind-aloft-' + i + '-tmp').innerHTML = waloftFcData.DATA[i].TMP;
    }
});

// SOARING FORECAST (GOOGLE CLOUD FUNCTION, PYTHON SCRAPE)
$.get("https://storage.googleapis.com/wasatch-wind-static/soaring.json", function(soarFcData) {
    document.getElementById('soar-forecast-date').innerHTML = soarFcData.REPORT_DATE;
    document.getElementById('max-rol').innerHTML = soarFcData.MAX_RATE_OF_LIFT;
    document.getElementById('max-rol-ms').innerHTML = soarFcData.MAX_RATE_OF_LIFT_MS;
    document.getElementById('neg3-index').innerHTML = soarFcData.NEG_3_INDEX;
    document.getElementById('neg3-index-m').innerHTML = soarFcData.NEG_3_INDEX_M;
    document.getElementById('top-of-lift').innerHTML = soarFcData.TOP_OF_LIFT;
    document.getElementById('top-of-lift-m').innerHTML = soarFcData.TOP_OF_LIFT_M;

    // // FULL (SUMMER) REPORT
    // document.getElementById('od-time').innerHTML = soarFcData.FULL.OD_TIME;
    // document.getElementById('cloudbase-lcl').innerHTML = soarFcData.FULL.CLOUDBASE_LCL;
    // document.getElementById('cloudbase-lcl-m').innerHTML = soarFcData.FULL.CLOUDBASE_LCL_M;
    // for (i=0; i<4; i++) {
    //     document.getElementById('kindex-' + [i]).innerHTML = soarFcDataGAE.FULL[i].K_NDX;
    //     document.getElementById('cape-' + [i]).innerHTML = soarFcDataGAE.FULL[i].CAPE;
    //     document.getElementById('li-' + [i]).innerHTML = soarFcDataGAE.FULL[i].LI;
    // }
});

//NOAA FORECAST (GOOGLE CLOUD FUNCTION, PYHON SCRAPE)
$.get("https://us-central1-wasatchwind.cloudfunctions.net/noaa-forecast-scrape", function(noaaFcData) {
    for (i=0; i<3; i++) {
        document.getElementById('forecast-day' + i +'-img').src = noaaFcData.IMAGE[i];
        document.getElementById('forecast-day' + i +'-day').innerHTML = noaaFcData.DAY[i];
        document.getElementById('forecast-day' + i +'-txt').innerHTML = noaaFcData.TEXT[i];
    }
});
