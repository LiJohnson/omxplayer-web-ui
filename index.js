
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var omxplayer = require("./omxplayer");

var control = {
  decreaseSpeed: '1',
  increaseSpeed: '2',
  previousAudioStream: 'j',
  nextAudioStream: 'k',
  previousChapter: 'i',
  nextChapter: 'o',
  previousSubtitleStream: 'n',
  nextSubtitleStream: 'm',
  toggleSubtitles: 's',
  decreaseSubtitleDelay: 'd',
  increaseSubtitleDelay: 'f',
  pause: 'pause',
  stop: 'stop',
  decreaseVolume: 'volume-down',
  increaseVolume: 'volume-up',
  seekForward: "\x5b\x43",
  seekBackward: "\x5b\x44",
  seekFastForward: "\x5b\x41",
  seekFastBackward: "\x5B\x42"
};

var file = "http://mr3.douban.com/201412040332/8bb51559e63654163053d64a28d79519/view/song/small/p753643.mp4";
//omxctrl.play(file);
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

io.on("connection",function(socket){
	socket.emit("control",control);
	socket.on("control",function(action){
		
		if( action.name == 'play' ){
			omxctrl.play(action.file || file);
		}else{
			omxctrl[action.name]();
		}
	});
})

server.listen(9090,function(){
	console.log("ha",9090);
});



