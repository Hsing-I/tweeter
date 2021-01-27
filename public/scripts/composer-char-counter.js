$(document).ready(function () {
  // --- our code goes here ---
  const textArea = $('#tweet-text');
  const maxCount = 140;

  textArea.on('input', function (event) {
    //debugger
    let userInput = this.value;
    const countEle = $(event.target).closest('section').find('.counter');
    let countDisplay = countEle[0];
    countDisplay.value = maxCount - userInput.length;
    if (countDisplay.value < 0) {
      countEle.css('color' , 'red');
    } else{
      countEle.css('color' , '#808080');
    }
  });

});