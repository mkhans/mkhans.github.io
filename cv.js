// WIND STATIONS (KEY API)
$.get("https://api.mesowest.net/v2/station/timeseries?&stid=LGP&stid=C8632&recent=90&obtimezone=local&timeformat=%-I:%M%20%p&vars=wind_speed,wind_gust,wind_direction,altimeter,air_temp&units=english,speed|mph,temp|F&token=6243aadc536049fc9329c17ff2f88db3", function(stationData) {
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
    for (i=0; i<stationCount; i++) {
        document.getElementById(stationData.STATION[i].STID + '-time').innerHTML = stationTime[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-speed').innerHTML = windSpeed[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-gust').innerHTML = windGust[i];
        document.getElementById(stationData.STATION[i].STID + '-wind-dir-img').src = windDirImg[i];
    }
});