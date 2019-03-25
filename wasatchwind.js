// Global variables

var today = new Date();         //For wasatchCam loop & skewT
var mn = today.getMinutes();    //wasatchCam loop only
var hr = today.getHours()-1;    //wasatchCam loop only, first pic back an hour for loop
var dd = today.getDate();       //For wasatchCam loop & skewT
var mm = today.getMonth()+1;    //For wasatchCam loop & skewT, add 1 to get current month (starts at 0)
var yyyy = today.getFullYear(); //For wasatchCam loop & skewT
var month = today.toLocaleString('en-us', {month: 'short'});  //For wasatchCam loop timestamp

mm = mm >= 10 ? mm : '0' + mm;  //Force double-digit month
dd = dd >= 10 ? dd : '0' + dd;  //Force double-digit date


// Draw Home Page Tables -------------------------------------------------------------------------------------------

google.charts.load('current', {packages: ['table']}); //Initialize Google Table API
google.charts.setOnLoadCallback(drawTable);

var quickStatsTableURL = 'https://spreadsheets.google.com/tq?key=1CpOU9TKZXwGu4h40TuGeVHI4fw8eMX_bube2AJY4taY&output=html&usp=sharing';
var windsAloftTableURL = 'https://spreadsheets.google.com/tq?key=1CpOU9TKZXwGu4h40TuGeVHI4fw8eMX_bube2AJY4taY&output=html&gid=1991668311&usp=sharing';
var threeDaysTableURL = 'https://spreadsheets.google.com/tq?key=1CpOU9TKZXwGu4h40TuGeVHI4fw8eMX_bube2AJY4taY&output=html&gid=1300046306&usp=sharing';

function drawTable() {
    var quickStatsData = new google.visualization.Query(quickStatsTableURL);
    var windsAloftData = new google.visualization.Query(windsAloftTableURL);
    var threeDaysData = new google.visualization.Query(threeDaysTableURL);
    quickStatsData.send(handleQuickStatsQuery);
    windsAloftData.send(handleWindsAloftQuery);
    threeDaysData.send(handleThreeDaysQuery);
    
} function handleQuickStatsQuery(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('QuickStatsTable'));
    visualization.draw(data, {allowHtml: true});
}

function handleWindsAloftQuery(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('WindsAloftTable'));
    visualization.draw(data, {allowHtml: true});
}

function handleThreeDaysQuery(response) {
    var data = response.getDataTable();
    visualization = new google.visualization.Table(document.getElementById('ThreeDaysTable'));
    visualization.draw(data, {allowHtml: true});
}

// Animate forecasted wind images ----------------------------------------------------------------------------------

function forecastedImgLoop(loopId, imgType) {
  var rotator = document.getElementById(loopId);
  var delay = 1800;
  var startTime = 1;
  var images = [];
  
  if (today.getHours() > 19 || today.getHours() < 8) { //Switch to next day images if after 7pm, switch back after 7am
      startTime = startTime + 4;
  }
    
  for (i = 0; i < 6; i++) { //Load images array
      images[i] = `https://graphical.weather.gov/images/slc/${imgType}${i + startTime}_slc.png`;
  }
  
  if (startTime === 5) { //Duplicate afternoon img for visual pause
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

setInterval(changeImage, delay); //Rotate images
};

forecastedImgLoop;


// Camera loop -----------------------------------------------------------------------------------------------------

function wasatchCamImgLoop() {
    
    function getPicURLArray() {
        var images = [];
        var timestamp = [];
        
        //Force minutes to 11, 26, 41, or 56 (when pics are updated)
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
wasatchCamImgLoop;
