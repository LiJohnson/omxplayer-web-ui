var exec = require('child_process').exec,
EventEmitter = require('events').EventEmitter,
  util = require('util');

//base on https://github.com/xat/omxctrl/blob/master/omxctrl.js
var keys = {
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
  pause: 'p', // toggle between pause and play
  stop: 'q',
  decreaseVolume: '-',
  increaseVolume: '+',
  seekForward: "\x5b\x43",
  seekBackward: "\x5b\x44",
  seekFastForward: "\x5b\x41",
  seekFastBackward: "\x5B\x42"
};

var omxplayer = function(file,option){
	if (!(this instanceof omxplayer)) return new omomxplayerx(file,option);

	var $this = this;

	var process = false;
	var playList = [];
	var option = false;
	var STATE = {
		PLAYING:1,
		PAUSE:2,
		STOP:3
	};
	var cur = 0;
	var state = STATE.STOP;
	this.p ;
	var init = function(){
		var file = playList[cur];

		if( !file )return;

		if( process && process.connected ){
			process.kill();
			exec('killall omxplayer');
			exec('killall omxplayer.bin');
			state = STATE.STOP
		}

		$this.p=process = exec('omxplayer ' + (option?option:'') + ' "'+file+'"');
		state = STATE.PLAYING;

		'close,exit,error'.split(',').forEach(function(e){
			process.on(e,function(code){
				state = STATE.STOP;
				cur++;
				init();
			});
		});
		

		process.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});
		process.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
	};

	this.play = function(file,option){
		if( file && typeof file === 'string' ){
			file = [file];
		}

		if(!file){
			return this.pause();
		}

		option = option;
		playList = file.concat(playList);
		cur = 0;
		init();
	}
	this.sendKey = function(key){
		if(!process)return;
		console.log("sending key : " + key);
		process.stdin.write(key);
	}
};
omxplayer.KEY = keys;

util.inherits(omxplayer, EventEmitter);
for( var name in keys  ){
	(function(name,key){
		console.log(name,key)
		omxplayer.prototype["shi"+name] = function(){
			this.sendKey(key)
		}
	})(name,keys[name]);
}
module.exports = omxplayer;