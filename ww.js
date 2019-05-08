// Get KSLC timeseries data in JSON format, parse, and modify for output
// ---------------------------------------------------------------------

var xhrTimeSeries = new XMLHttpRequest(); // xhr to hold the timeseries JSON data for KSLC
xhrTimeSeries.open('GET', 'https://api.mesowest.net/v2/station/timeseries?&stid=kslc&recent=30&obtimezone=local&timeformat=%b%20%d%20-%20%H:%M&vars=air_temp,wind_speed,wind_direction,wind_cardinal_direction,altimeter&units=english,speed|mph&token=6243aadc536049fc9329c17ff2f88db3', true);
xhrTimeSeries.responseType = 'text';
xhrTimeSeries.send();
xhrTimeSeries.onload = function() {
    if(xhrTimeSeries.status === 200) { // 200 indicates successful query
        var weatherData = JSON.parse(xhrTimeSeries.responseText);
        console.log(weatherData);
        var dataArrayLength = weatherData.STATION[0].OBSERVATIONS.date_time.length - 1; // Returned array varies; need to know where it ends to get most recent data point

        // Get date (format "mmm dd") & most recent time (adjust for 12h)
        var reportMonth = weatherData.STATION[0].OBSERVATIONS.date_time[dataArrayLength].substr(0, 3);
        var reportDay = weatherData.STATION[0].OBSERVATIONS.date_time[dataArrayLength].substr(4, 2);
            if(parseInt(reportDay) < 10) {
                reportDay = reportDay.substr(1, 1);
            }
        var ampm = " am";
        var dateHour = parseInt(weatherData.STATION[0].OBSERVATIONS.date_time[dataArrayLength].substr(9, 2));
            if(dateHour > 11) {
                ampm = " pm";
                if (dateHour > 12) {
                    dateHour = dateHour - 12;
                }
            }
        var dateToday = new Date();
        var weekdayNumber = dateToday.getDay();
        var weekdays = [];
            weekdays[0] = "Sun";
            weekdays[1] = "Mon";
            weekdays[2] = "Tue";
            weekdays[3] = "Wed";
            weekdays[4] = "Thu";
            weekdays[5] = "Fri";
            weekdays[6] = "Sat";
        var weekday = weekdays[weekdayNumber];
    
        
        var dateAndTime = weekday + ", " + reportMonth + " " + reportDay + " @ " + dateHour + ":" + weatherData.STATION["0"].OBSERVATIONS.date_time[dataArrayLength].substr(12, 2) + ampm;
        
        document.getElementById('kslc-date-time').innerHTML = dateAndTime;
        
        // Get wind direction image
        var windDir = weatherData.STATION[0].OBSERVATIONS.wind_direction_set_1[dataArrayLength];
            if (windDir > 180) {
                windDir = windDir - 180;
            } else {
                windDir = windDir + 180;
            }
        var windDirURL = "<img src='http://www.usairnet.com/weather/winds_aloft/a" + windDir + ".gif'>";
        document.getElementById('wind-dir-img').innerHTML = windDirURL;
        
        // Get wind direction cardinal
        var windDirCard = weatherData.STATION[0].OBSERVATIONS.wind_cardinal_direction_set_1d[dataArrayLength];
        document.getElementById('wind-dir-card').innerHTML = windDirCard;
        
        // Get wind speed, round to integer
        var windSpeed = Math.round(weatherData.STATION[0].OBSERVATIONS.wind_speed_set_1[dataArrayLength]);
        document.getElementById('wind-speed').innerHTML = windSpeed;
        
        // Get pressure
        var pressure = weatherData.STATION[0].OBSERVATIONS.altimeter_set_1[dataArrayLength].toFixed(2);
        document.getElementById('pressure').innerHTML = pressure;
        
                
        // Get temp, round to integer
        var temp = Math.round(weatherData.STATION[0].OBSERVATIONS.air_temp_set_1[dataArrayLength]) + "°";
        document.getElementById('temp').innerHTML = temp;

    } else {
        return "Data Error";
    }
}

// Get Soaring Forecast data in JSON format, parse, and modify for output
// ----------------------------------------------------------------------

var xhrSoringForecast = new XMLHttpRequest(); // xhr to hold Soaring Forecast JSON data
xhrSoringForecast.open('GET', 'http://www.pythonanywhere.com/user/mkhans/files/home/mkhans/soarfcastjson.json', true);
xhrSoringForecast.responseType = 'text';
xhrSoringForecast.send();
xhrSoringForecast.onload = function() {
    if(xhrSoringForecast.status === 200) { // 200 indicates successful query
        var soaringForecastData = JSON.parse(xhrSoringForecast.responseText);
        console.log(soaringForecastData);
        
        var reportDate = soaringForecastData.SOARING_FORECAST_DATA[0].report_date;
        document.getElementById('report-date').innerHTML = reportDate;
        
        var maxRateOfLift = soaringForecastData.SOARING_FORECAST_DATA[1].max_rol;
        document.getElementById('max-rol').innerHTML = maxRateOfLift;
        
        var topOfLift = soaringForecastData.SOARING_FORECAST_DATA[2].top_of_lift;
        document.getElementById('top-of-lift').innerHTML = topOfLift;
        
        var overDevTime = soaringForecastData.SOARING_FORECAST_DATA[3].od;
        document.getElementById('od-time').innerHTML = overDevTime;
        
        var neg3Index = soaringForecastData.SOARING_FORECAST_DATA[4].neg3_index;
        document.getElementById('neg3-index').innerHTML = neg3Index;

    } else {
        return "Data Error";
    }
}
