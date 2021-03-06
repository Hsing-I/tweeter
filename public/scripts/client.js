/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  //ajax get reuqest to fetch all the tweets stored in the server
  const loadTweets = function () {
    $.ajax({
      url: `http://localhost:8080/tweets`,
      method: 'GET',
    })
      .done((result) => {
        renderTweets(result);
      })
      .fail(() => console.log('error'));
  }

  //iterate throught all the tweets and prepend to the tweet-display section 
  const renderTweets = function (tweets) {
    $(".tweets-display").empty();
    for (const tweet of tweets) {
      $('.tweets-display').prepend(createTweetElement(tweet));
    };
  };

  //escape function to prevent XSS attack
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  //create a tweet 
  const createTweetElement = function (tweet) {
    const tweetObj =
      `<aritcle class="tweet-display">
        <header class="tweet-display-header">
          <div>
            <img src=${tweet.user.avatars} id="posted-user"></i>
            <span>${tweet.user.name}</span>
          </div>
          <span class="hide">${tweet.user.handle}</span>
        </header>
        <div class="content">
          <p>${escape(tweet.content.text)}</p>
          <div class="hline"></div>
        </div>
        <footer class="tweet-display-footer">
          <span>${calDate(tweet.created_at)}</span>
          <div class="tweet-display-icons">
            <i class="fas fa-flag"></i>
            <i class="fas fa-square"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </aritcle>`
    return tweetObj;
  };

  //convert the ms to the day difference between the time tweeted and now 
  const calDate = function (timeString) {
    return moment(timeString).fromNow();
  }

  //validate the user input and send the tweet to the server by ajax post request
  $('#tweet-form').on('submit', function (event) {
    event.preventDefault();
    const tweetInput = $(this).serialize();
    if (tweetInput.length === 5) {
      $('#error-message').html("<span>&#9888;</span> please input the text! <span>&#9888;</span>").slideDown();
    } else if (tweetInput.length > 145) {
      $('#error-message').html("<span>&#9888;</span> please input less than or equal to 140 characters! <span>&#9888;</span>").slideDown();
    } else {
      $.ajax({
        url: `http://localhost:8080/tweets`,
        method: 'POST',
        data: tweetInput,
      })
        .then(() => {
          loadTweets();
          $("#tweet-text").val("");
          const counterReset = $(this).closest('section').find('.counter');
          counterReset[0].value = 140;
          counterReset.css('color', '#808080');
          $('#tweet-form').slideUp();
          $('#error-message').slideUp();
        })
        .catch(() => console.log('error'));
    }
  });

  $('#down-arrow').on('click', function () {
    $('#tweet-form').toggle();

  });

  loadTweets();

});

