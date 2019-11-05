///////////////////////
// C O N S T A N T S //
///////////////////////

const season = "winter";
const today = new Date();
// var yyyy = today.getFullYear();
const monthName = today.toLocaleString('en-us', {month: 'short'});
// var monthNum = today.getMonth() + 1;
// var month2Digit = (monthNum < 10) ? "0" + monthNum : monthNum;
const dayName = today.toLocaleDateString('en-us', {weekday: 'short'});
const dayNum = today.getDate();
// var day2Digit = (dayNum < 10) ? "0" + dayNum : dayNum;
// var hour = today.getHours();
// var threePM = (hour > 20 || hour < 8) ? 7 : 3;
// var noaaImgURLBase = "https://forecast.weather.gov/";
// var scrapeURLBase = "https://whatever-origin.herokuapp.com/get?url=";

document.getElementById('date-today').innerHTML = dayName + ", " + monthName + " " + dayNum;
document.getElementById('temp').innerHTML = "55 ⮞ 22";

/////////////////////////////////////////////////////////////////
// W I N D   S T A T I O N   T I M E   S E R I E S   ( A P I ) //
/////////////////////////////////////////////////////////////////

$.get("https://api.mesowest.net/v2/station/timeseries?&stid=OGP&stid=MSI01&stid=C8948&stid=PKC&stid=FPS&stid=FPN&stid=KSLC&stid=KU42&recent=90&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=wind_speed,wind_gust,wind_direction,altimeter&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3", function(stationData) {
    let stationCount = stationData.STATION.length;
    let stationObservationsCount = [], stationName = [], stationHour = [], stationAMPM = [], stationMins = [], latestTimes = [], windSpeeds = [], windGusts = [], windDirImgs = [];

    // GET MOST RECENT READING FOR EACH STATION
    for (i=0; i<stationCount; i++) {
        stationObservationsCount[i] = stationData.STATION[i].OBSERVATIONS.date_time.length - 1;
    }

    // STATION NAMES
    for (i=0; i<stationCount; i++) {
        stationName[i] = stationData.STATION[i].STID;
        stationName[i] = (stationName[i] == "OGP") ? "Ogden Peak" : stationName[i];
        stationName[i] = (stationName[i] == "PKC") ? "Jupiter" : stationName[i];
        stationName[i] = (stationName[i] == "MSI01") ? "Olympus MSI" : stationName[i];
        stationName[i] = (stationName[i] == "C8948") ? "Centerville" : stationName[i];
        stationName[i] = (stationName[i] == "FPS") ? "Southside" : stationName[i];
        stationName[i] = (stationName[i] == "FPN") ? "Northside" : stationName[i];
        stationName[i] = (stationName[i] == "KU42") ? "Airport 2" : stationName[i];
    }

    // MOST RECENT TIME STAMP
    for (i=0; i<stationCount; i++) {
        stationHour[i] = parseInt(stationData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(9,2));
        stationAMPM[i] = (stationHour[i] > 11) ? stationAMPM[i] = " pm" : stationAMPM[i] = " am";
        stationHour[i] = (stationHour[i] > 12) ? stationHour[i] -= 12 : stationHour[i];
        stationHour[i] = (stationHour[i] == 0) ? stationHour[i] = 12 : stationHour[i];
        stationMins[i] = stationData.STATION[i].OBSERVATIONS.date_time[stationObservationsCount[i]].substr(12, 2);
        latestTimes[i] = stationHour[i] + ":" + stationMins[i] + stationAMPM[i];
        console.log(latestTimes[i]);
    }

    // ROUND & LOAD WIND SPEED & GUST, "---" IF NULL OR NO DATA
    for (i=0; i<stationCount; i++) {
        try {
            windSpeeds[i] = stationData.STATION[i].OBSERVATIONS.wind_speed_set_1[stationObservationsCount[i]];
            windSpeeds[i] = (parseInt(windSpeeds[i]) > 0) ? windSpeeds[i] = Math.round(windSpeeds[i]) : "<p class='txtsz50'>Calm</p>";
        }
        catch(err) {
            windSpeeds[i] = "No Data";
        }
        
        try {
            windGusts[i] = stationData.STATION[i].OBSERVATIONS.wind_gust_set_1[stationObservationsCount[i]];
            windGusts[i] = (parseInt(windGusts[i]) > 0) ? windGusts[i] = Math.round(windGusts[i]) : "";
        }
        catch(err) {
            windGusts[i] = "";
        }
    }

    // WIND DIRECTION IMAGES
    for (i=0; i<stationCount; i++) {
        try {
            windDirImgs[i] = stationData.STATION[i].OBSERVATIONS.wind_direction_set_1[stationObservationsCount[i]];
            windDirImgs[i] = Math.round(windDirImgs[i] / 10) * 10;
            if (windDirImgs[i] != NaN) {
                windDirImgs[i] = (windDirImgs[i] === 0) ? windDirImgs[i] = "00" : windDirImgs[i];
                windDirImgs[i] = (windDirImgs[i] < 100) ? windDirImgs[i] = "0" + windDirImgs[i] : windDirImgs[i];
                windDirImgs[i] = "images/winddirimages/d" + windDirImgs[i] + ".gif";
            } else {
                windDirImgs[i] = "images/winddirimages/nodata.gif";
            }
        }
        catch(err) {
            windDirImgs[i] = "images/winddirimages/nodata.gif";
        }
    }

    // MOST RECENT PRESSURE KSLC
    let pressure = stationData.STATION[0].OBSERVATIONS.altimeter_set_1[stationObservationsCount[0]];

    // GET ELEMENT BY ID
    document.getElementById('pressure').innerHTML = pressure;

    if (stationName[0] != undefined) {
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

// GET JSON DATA FROM PYTHONANYWHERE SCRAPE
// $.getJSON("https://mkhans.pythonanywhere.com", function(pythonData) {
//     console.log(pythonData);
//     document.getElementById('winds-aloft-forecast-start').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_start_time;
//     document.getElementById('winds-aloft-forecast-end').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_end_time;
//     document.getElementById('winds-aloft-forecast-day').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_day;
//     document.getElementById('wind-aloft-6k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_6k;
//     document.getElementById('wind-aloft-9k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_9k;
//     document.getElementById('wind-aloft-12k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_12k;
//     document.getElementById('wind-aloft-18k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_18k;
//     document.getElementById('wind-aloft-6k-dir').src = "https://mkhans.github.io/WW3" + pythonData.WIND_ALOFT_DATA.dir_6k;
//     document.getElementById('wind-aloft-9k-dir').src = "https://mkhans.github.io/WW3" + pythonData.WIND_ALOFT_DATA.dir_9k;
//     document.getElementById('wind-aloft-12k-dir').src = "https://mkhans.github.io/WW3" + pythonData.WIND_ALOFT_DATA.dir_12k;
//     document.getElementById('wind-aloft-18k-dir').src = "https://mkhans.github.io/WW3" + pythonData.WIND_ALOFT_DATA.dir_18k;
//     document.getElementById('wind-aloft-9k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_9k;
//     document.getElementById('wind-aloft-12k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_12k;
//     document.getElementById('wind-aloft-18k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_18k;

//     document.getElementById('soar-forecast-report-date').innerHTML = pythonData.SOARING_FORECAST_DATA.report_date;
//     document.getElementById('max-rol').innerHTML = pythonData.SOARING_FORECAST_DATA.max_rate_of_lift;
//     document.getElementById('top-of-lift').innerHTML = pythonData.SOARING_FORECAST_DATA.top_of_lift;
//     document.getElementById('neg3-index').innerHTML = pythonData.SOARING_FORECAST_DATA.height_of_negative3_index;
//     document.getElementById('lcl').innerHTML = pythonData.SOARING_FORECAST_DATA.cloudbase_lcl;
//     document.getElementById('od-time').innerHTML = pythonData.SOARING_FORECAST_DATA.overdevelopment_time;
//     document.getElementById('kindex-9').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_9a;
//     document.getElementById('kindex-12').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_12p;
//     document.getElementById('kindex-3').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_3p;
//     document.getElementById('kindex-6').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_6p;
//     document.getElementById('cape-9').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_9a;
//     document.getElementById('cape-12').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_12p;
//     document.getElementById('cape-3').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_3p;
//     document.getElementById('cape-6').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_6p;
//     document.getElementById('li-9').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_9a;
//     document.getElementById('li-12').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_12p;
//     document.getElementById('li-3').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_3p;
//     document.getElementById('li-6').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_6p;
// });

// BUTTON EXPAND & COLLAPSE
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