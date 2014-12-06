var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var omxplayer = require("omxctrl");

var control = {
//decreaseSpeed: '1',
//increaseSpeed: '2',
//previousAudioStream: 'j',
//nextAudioStream: 'k',
//previousChapter: 'i',
//nextChapter: 'o',
//previousSubtitleStream: 'n',
//nextSubtitleStream: 'm',
//toggleSubtitles: 's',
//decreaseSubtitleDelay: 'd',
//increaseSubtitleDelay: 'f',
	pause: 'pause',
	stop: 'stop',
	decreaseVolume: 'volume-down',
	increaseVolume: 'volume-up'
//seekForward: "\x5b\x43",
//seekBackward: "\x5b\x44",
//seekFastForward: "\x5b\x41",
//seekFastBackward: "\x5B\x42"
};

var file = "http://mr3.douban.com/201412040332/8bb51559e63654163053d64a28d79519/view/song/small/p753643.mp4";

var handleControl = function(action){
	if( action.name == 'play' ){
		omxplayer.play(action.file,[]);
	}else{
		omxplayer[action.name]();
	}
};

//omxctrl.play(file);

app.get("/",function(req,res){	
	var file = __dirname + "/index.html";
	res.sendFile(file);
});

app.get("/static/*",function(req,res){
	var file = __dirname + "/lib" + req._parsedUrl.pathname.replace(/^\/?static/,'');
	console.log(file);
	res.sendFile(file);
});

app.get("/action/:name",function(req,res){
	handleControl({name:req.params.name , file:req.query.file});
	res.send("ko");
});

io.on("connection",function(socket){
	socket.emit("control",control);
	socket.on("control",function(action){
		handleControl(action);
	});
});

omxplayer.on("playing",function(file){
	"stdout,stderr".split(',', function(std){
		omxplayer.player[std].on("data",function(data){
			console.log( std + " data " + data);
		});
	});
	console.log("playing " + file);
});

server.listen(9191,function(){
	console.log("ha",9191);
});
