/*  HELPERS   */

// get time string
function getTime () {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    return `${h}:${m}:${s}`;
}

// format time
function checkTime (i) {
     if (i < 10) {
      i = "0" + i;
  }
    return i;
 }


// show error
function showError(errString) {
    let notifyDiv = $('<div class="notification is-danger has-text-centered"></div>');
    let closeButton = $('<button id="close"></button>');
    // add class
    closeButton.addClass('delete');
    // add elements to notification div
    notifyDiv.prepend(closeButton);
    notifyDiv.append(errString);
    // atach notification error to dom
    $('#notifyContainer').html(notifyDiv);

    // remove error notify after 5s if not closed by user
    setTimeout(function() {
        $('#notifyContainer').empty();
    }, 5000);

    // listen for close click
    $('#close').click(function(e) {
        $('#notifyContainer').empty();
    });
}

function showMessage(data) {
    // messages container
    const messages = $("#messages");

    // message item
    let message = $("<li></li>");
    // add class
    message.addClass('box list-item has-text-dark');
    // add diferent background color for msg sender
    if (username === data.username) {
        message.addClass('has-background-grey-light')
    } else {
        message.addClass('has-background-white-bis');
    }

    // messages close button
    let closeButton = $('<button></button>');
    // add class
    closeButton.addClass('delete close');
    // prepend button to nameHolder
    message.prepend(closeButton);

    // name of chat user
    let nameHolder = $("<p></p>");
    // add class
    nameHolder.addClass('username has-text-weight-semibold');
    // add content
    nameHolder.html("From: <span class='is-italic'>" + data.username + "</span>");
    // append name to message item
    message.append(nameHolder);

    // message text holder
    let msgHolder = $("<p></p>");
    // add class
    msgHolder.addClass('msg has-text-justified');
    // add content
    msgHolder.text(data.message);
    // append message-text to message item
    message.append(msgHolder);

    // message timestamp holder
    let timestamp = $("<p></p>");
    // add class
    timestamp.addClass('timestamp is-italic has-text-right is-size-7');
    // add content
    timestamp.text(data.created);
    // append send time to message item
    message.append(timestamp);

    // append message to end of message container
    message.appendTo(messages);

    // scroll messages window to last msg
    let p = $('.box:last').position();
    messages.scrollTop(p.top + 50);

    // atach event listener to close msg buttons
    $('.close').on('click', function(e) {
        $(this).parent('.list-item').remove();
    });

}

// throttle sending typing event
function throttle(cb, threshhold = 250) {
    let last, deferTimer;
    return (...args) => {
        let now = +new Date();
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                cb.apply(this, args);
            }, threshhold + last - now);
        } else {
            last = now;
            cb.apply(this, args);
        }
    }
}
