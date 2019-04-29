// Get KSLC timeseries data in JSON format, parse, and modify for output -------------------------------------------------------------------------------------------------------------------

var xhr = new XMLHttpRequest(); // xhr to hold the timeseries JSON data for KSLC
xhr.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=kslc&recent=35&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=air_temp,wind_speed,wind_direction,wind_cardinal_direction,altimeter&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhr.responseType = 'text';
xhr.send();
xhr.onload = function() {
    if(xhr.status === 200) { // 200 indicates successful query
        var weatherData = JSON.parse(xhr.responseText);
        console.log(weatherData);
        var dataArrayLength = weatherData.STATION["0"].OBSERVATIONS.date_time.length - 1; // Returned array varies; need to know where it ends to get most recent data point

        // Get date (format "mmm dd") & most recent time (adjust for 12h)
        var dateToday = weatherData.STATION["0"].OBSERVATIONS.date_time[dataArrayLength].substr(0, 6);
        var ampm = " am";
        var dateHour = parseInt(weatherData.STATION["0"].OBSERVATIONS.date_time[dataArrayLength].substr(9, 2));
            if(dateHour > 11) {
                ampm = " pm";
                if (dateHour > 12) {
                    dateHour = dateHour - 12;
                }
            }
        var dateAndTime = dateToday + " @ " + dateHour + ":" + weatherData.STATION["0"].OBSERVATIONS.date_time[dataArrayLength].substr(12, 2) + ampm;
        document.getElementById('kslc-date-time').innerHTML = "KSLC, " + dateAndTime;
        
        // Get wind direction image
        var windDir = weatherData.STATION["0"].OBSERVATIONS.wind_direction_set_1[dataArrayLength];
            if (windDir > 180) {
                windDir = windDir - 180;
            } else {
                windDir = windDir + 180;
            }
        var windDirURL = "<img src='http://www.usairnet.com/weather/winds_aloft/a" + windDir + ".gif'>";
        document.getElementById('wind-dir-img').innerHTML = windDirURL;
        
        // Get wind direction cardinal
        var windDirCard = weatherData.STATION["0"].OBSERVATIONS.wind_cardinal_direction_set_1d[dataArrayLength];
        document.getElementById('wind-dir-card').innerHTML = windDirCard;
        
        // Get wind speed, round to integer
        var windSpeed = Math.round(weatherData.STATION["0"].OBSERVATIONS.wind_speed_set_1[dataArrayLength]);
        document.getElementById('wind-speed').innerHTML = windSpeed;
        
        // Get pressure
        var pressure = weatherData.STATION["0"].OBSERVATIONS.altimeter_set_1[dataArrayLength];
        document.getElementById('pressure').innerHTML = pressure;
        
                
        // Get temp, round to integer
        var temp = Math.round(weatherData.STATION["0"].OBSERVATIONS.air_temp_set_1[dataArrayLength]) + "°";
        document.getElementById('temp').innerHTML = temp;

    } else {
        return "Data Error";
    }
}