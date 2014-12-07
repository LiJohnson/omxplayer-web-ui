var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var omxplayer = require("omxctrl");
var exec = require('child_process').exec;
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

var vol = 0;

var handleControl = function(action){
	if( action.name == 'decreaseVolume' )vol -= 300;
	if( action.name == 'increaseVolume' )vol += 300;
	if( action.name == 'stop' )vol = 0;

	if( action.name == 'play' ){
		if( action.file ){
			omxplayer.stop();
			exec('killall omxplayer.bin');
		}
		omxplayer.play(action.file,["--vol " + vol ]);
	}else{
		omxplayer[action.name]();
	}
};


app.get("/",function(req,res){	
	var file = __dirname + "/index.html";
	res.sendFile(file);
});

app.get("/static/*",function(req,res){
	var file = __dirname + "/lib" + req._parsedUrl.pathname.replace(/^\/?static/,'');
	//console.log(file);
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
	console.log("playing " + file);
	console.log("vol " + vol);
	setTimeout(function(){
		"data,message,ended".split(",").forEach(function(e){
			omxplayer.player.stdout.on(e,function(data){
				console.log(e,data);
			});
		});
	},3000)
});

server.listen(9191,function(){
	console.log("ha",9191);
});
