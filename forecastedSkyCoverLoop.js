(function() {
  var rotator = document.getElementById('rotator');
  var delay = 1800;
  var time = new Date();
  var timejump = 1;
  var images = [];
  
  if (time.getHours() > 18) { //Switch to next day images if after 9pm
      timejump = timejump + 4;
  }
    
  for (i = 0; i < 6; i++) { //Load images array
      images[i] = `https://graphical.weather.gov/images/slc/Sky${i + timejump}_slc.png`;
  }
  
  if (timejump === 5) { //Duplicate 3pm for visual pause
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/Sky7_slc.png");
  } else {
  	images.splice (3, 0, "https://graphical.weather.gov/images/slc/Sky3_slc.png");
  }

  var loopCount = 0;
  var changeImage = function() {
      var length = images.length - 1;
      rotator.src = images[loopCount++];
      // document.write(images[loopCount++] + "<br>");
      if (loopCount == length) {
          loopCount = 0;
      }
};

setInterval(changeImage, delay); //Rotate images
})();
