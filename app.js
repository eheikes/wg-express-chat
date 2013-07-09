
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var users = {};
var messages = [];

io.sockets.on('connection', function(socket) {
	socket.emit('auth', {messages: messages}); 

	socket.on('setnick', function(data) {
    if (data.nickname) {
  		users[data.nickname] = { nickname: data.nickname };
  		console.log(users);
  		io.sockets.emit('updateusers', {users: users});
    }
	});

  socket.on('send', function(data) {
    if (data.message) {
      console.log(data);
      messages.push(data);
      io.sockets.emit('addmessage', data);
    }
  });

});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
