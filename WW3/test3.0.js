///////////////////////
// C O N S T A N T S //
///////////////////////

const season = "winter";
const today = new Date();
const monthName = today.toLocaleString('en-us', {month: 'short'});
const dayName = today.toLocaleDateString('en-us', {weekday: 'short'});
const dayNum = today.getDate();

document.getElementById('date-today').innerHTML = dayName + ", " + monthName + " " + dayNum;

/////////////////////////////////////////////////////////////////
// W I N D   S T A T I O N   T I M E   S E R I E S   ( A P I ) //
/////////////////////////////////////////////////////////////////

$.get("https://api.mesowest.net/v2/station/timeseries?&stid=OGP&stid=MSI01&stid=C8948&stid=PKC&stid=FPS&stid=FPN&stid=KSLC&stid=KU42&recent=90&obtimezone=local&timeformat=%-I:%M%20%p&vars=wind_speed,wind_gust,wind_direction,altimeter,air_temp&units=english,speed|mph,temp|F&token=6243aadc536049fc9329c17ff2f88db3", function(stationData) {
// MESONET TIME SERIES INFO PAGE: https://developers.synopticdata.com/mesonet/v2/stations/timeseries
// DECLARE VARIABLES
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
        } catch(err) {
            windGust[i] = "";
        }
        try {
            windDirImg[i] = Math.round(stationData.STATION[i].OBSERVATIONS.wind_direction_set_1[stationLatestReadingPosition[i]] / 10) * 10;
            windDirImg[i] = (windDirImg[i] < 100) ? windDirImg[i] = "0" + windDirImg[i] : windDirImg[i];
            windDirImg[i] = (isNaN(windSpeed[i])) ? "calm" : windDirImg[i];
            windDirImg[i] = "images/winddirimages/d" + windDirImg[i] + ".gif";
        } catch(err) {
            windDirImg[i] = "images/winddirimages/nodata.gif";
        }
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

///////////////////////////////////////////////
// G E T   S U N S E T   T I M E   ( A P I ) //
///////////////////////////////////////////////

$.get("https://api.sunrise-sunset.org/json?lat=40.789900&lng=-111.979100&date=today&formatted=0", function(slcSolarData) {
    let sunsetSLC = new Date(slcSolarData.results.sunset);
    let sunsetSLCMins = sunsetSLC.getMinutes();
    sunsetSLCMins = (sunsetSLCMins < 10) ? "0" + sunsetSLCMins : sunsetSLCMins;
    sunsetSLC = sunsetSLC.getHours() - 12 + ":" + sunsetSLCMins;
    document.getElementById('sunset-time').innerHTML = sunsetSLC;
});

/////////////////////////////////////////////////////
// B U T T O N   E X P A N D   &   C O L L A P S E //
/////////////////////////////////////////////////////

let btnCollapse = document.getElementsByClassName("collapsible");
for (i=0; i<btnCollapse.length; i++) {
    btnCollapse[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let btnDraw = this.nextElementSibling;
        if (btnDraw.style.maxHeight){
            btnDraw.style.maxHeight = null;
        } else {
            btnDraw.style.maxHeight = btnDraw.scrollHeight + "px";
        }
    });
}