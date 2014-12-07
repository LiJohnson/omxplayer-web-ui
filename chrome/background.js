var isListening = localStorage.isListening == 'true';
	
var get = function(action,data){
	data = (function(data){
		var tmp = [];
		for( var i in data ){
			tmp.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
		}
		return tmp.join("&");
	})(data||{});
	var xhr = new XMLHttpRequest();
	xhr.open("GET",localStorage.host+"/action/"+action+"?"+data);
	xhr.send(data||null);
};

chrome.webRequest.onResponseStarted.addListener(function(data){
	if( !isListening )return;

	if( data.type.match(/audio|video|stream|other/) ){
		if( data.url.match(/\.mp[34]/i) ){
			console.log(data,data.url);
			get("play",{file:data.url})
		}
	}
	console.log(data.type,data);
	return data;
}
,{
	urls: ["*://*.baidu.com/*","*://*.xiami.com/*","*://*.douban.com/*"],
	types:["other","object"]
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	isListening = msg.listening;
	if( !msg.listening ){
		get("stop");
	}
});
