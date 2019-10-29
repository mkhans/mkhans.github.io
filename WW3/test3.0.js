/////////////////////////////////////
// G L O B A L   V A R I A B L E S //
/////////////////////////////////////

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
// var windImgURLBase = "https://www.usairnet.com/weather/winds_aloft/";
// var scrapeURLBase = "https://whatever-origin.herokuapp.com/get?url=";

document.getElementById('date-today').innerHTML = dayName + ", " + monthName + " " + dayNum;

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

// GET JSON DATA FROM PYTHONANYWHERE SCRAPE
$.getJSON("https://mkhans.pythonanywhere.com", function(pythonData) {
    console.log(pythonData);
    document.getElementById('winds-aloft-forecast-start').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_start_time;
    document.getElementById('winds-aloft-forecast-end').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_end_time;
    document.getElementById('winds-aloft-forecast-day').innerHTML = pythonData.WIND_ALOFT_DATA.forecast_day;
    document.getElementById('wind-aloft-6k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_6k;
    document.getElementById('wind-aloft-9k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_9k;
    document.getElementById('wind-aloft-12k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_12k;
    document.getElementById('wind-aloft-18k-spd').innerHTML = pythonData.WIND_ALOFT_DATA.spd_18k;
    document.getElementById('wind-aloft-6k-dir').src = pythonData.WIND_ALOFT_DATA.dir_6k;
    document.getElementById('wind-aloft-9k-dir').src = pythonData.WIND_ALOFT_DATA.dir_9k;
    document.getElementById('wind-aloft-12k-dir').src = pythonData.WIND_ALOFT_DATA.dir_12k;
    document.getElementById('wind-aloft-18k-dir').src = pythonData.WIND_ALOFT_DATA.dir_18k;
    document.getElementById('wind-aloft-9k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_9k;
    document.getElementById('wind-aloft-12k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_12k;
    document.getElementById('wind-aloft-18k-tmp').innerHTML = pythonData.WIND_ALOFT_DATA.tmp_18k;

    document.getElementById('soar-forecast-report-date').innerHTML = pythonData.SOARING_FORECAST_DATA.report_date;
    document.getElementById('max-rol').innerHTML = pythonData.SOARING_FORECAST_DATA.max_rate_of_lift;
    document.getElementById('top-of-lift').innerHTML = pythonData.SOARING_FORECAST_DATA.top_of_lift;
    document.getElementById('neg3-index').innerHTML = pythonData.SOARING_FORECAST_DATA.height_of_negative3_index;
    document.getElementById('lcl').innerHTML = pythonData.SOARING_FORECAST_DATA.cloudbase_lcl;
    document.getElementById('od-time').innerHTML = pythonData.SOARING_FORECAST_DATA.overdevelopment_time;
    document.getElementById('kindex-9').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_9a;
    document.getElementById('kindex-12').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_12p;
    document.getElementById('kindex-3').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_3p;
    document.getElementById('kindex-6').innerHTML = pythonData.SOARING_FORECAST_DATA.k_index_6p;
    document.getElementById('cape-9').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_9a;
    document.getElementById('cape-12').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_12p;
    document.getElementById('cape-3').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_3p;
    document.getElementById('cape-6').innerHTML = pythonData.SOARING_FORECAST_DATA.cape_6p;
    document.getElementById('li-9').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_9a;
    document.getElementById('li-12').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_12p;
    document.getElementById('li-3').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_3p;
    document.getElementById('li-6').innerHTML = pythonData.SOARING_FORECAST_DATA.lifted_index_6p;
});