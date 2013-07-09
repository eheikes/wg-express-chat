var nickname = ''
  , socket = io.connect('http://192.168.1.30:3000');

function addMessage(data) {
  var msg = data.message,
      //regex = new RegExp('/@' + nickname + '/', 'g'),
      css = msg.indexOf('@' + nickname) >= 0 ? 'me' : '';

  $('<li/>')
    .attr('data-nickname', data.user)
    .addClass(css)
    .text(msg)
    .appendTo($('.chat-messages ul'));
}

socket.on('auth', function(data) {
  var i;

  $('.chat-messages ul').empty();
  console.log(data.messages);
  for (i = 0; i < data.messages.length; i++) {
    addMessage(data.messages[i]);
  }

	nickname = prompt("What is your nickname?");
	socket.emit('setnick', {nickname: nickname});
});

socket.on('updateusers', function(data) {
  var list = $('.presence ul'),
      user,
      list_item;
  
  list.empty();

	for (user in data.users) {
    if (data.users.hasOwnProperty(user)) {
      console.log(user);
      list_item = $('<li/>').text(data.users[user].nickname);
      if (data.users[user].nickname === nickname) {
        list_item.addClass('current');
        $('<style/>').text('li[data-nickname='+nickname+'] { background: #cc0;}').appendTo('body');
      }
      list_item.appendTo(list);
    }
  }
});

socket.on('addmessage', function(data) {
  console.log('receiving message: ', data);
  addMessage(data);
});

$('#sendmessage').submit(function(event) {
  var data = { user: nickname, message: $('#message').val() };
  console.log('sending message: ', data);
  socket.emit('send', data);
  $('#message').val('');
  event.preventDefault();
});
