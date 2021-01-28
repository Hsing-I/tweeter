/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

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

  const renderTweets = function (tweets) {
    for (const tweet of tweets) {
      $('.tweets-display').prepend(createTweetElement(tweet));
    };
  };

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

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
          <span>${calDate(tweet.created_at)} days ago</span>
          <div class="tweet-display-icons">
            <i class="fas fa-flag"></i>
            <i class="fas fa-square"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </aritcle>`
    return tweetObj;
  };

  const calDate = function (timeString) {
    const date = moment(timeString);
    return moment().diff(date, "days");
    //const daysMs = Date.now() - timeString;
    //return daysMs/86400000;
  }

  $('#tweet-form').on('submit', function (event) {
    event.preventDefault();
    const tweetInput = $(this).serialize();
    if (tweetInput.length === 5) {
      $('#error-message').text("please input the text!").slideDown();
    } else if (tweetInput.length > 145) {
      $('#error-message').text("please input less than or equal to 140 characters!").slideDown();
    } else {
      $.ajax({
        url: `http://localhost:8080/tweets`,
        method: 'POST',
        data: tweetInput,
      })
        .done(() => {
          loadTweets();
          $("#tweet-text").val("");
          const counterReset = $(this).closest('section').find('.counter');
          counterReset[0].value = 140;
          counterReset.css('color', '#808080');
          $('#error-message').slideUp();
        })
        .fail(() => console.log('error'));
    }
  });


  loadTweets();
});

