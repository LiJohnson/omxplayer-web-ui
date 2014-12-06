var isListening = false;

var get = function(action,data){
	var xhr = new XMLHttpRequest();
	xhr.open("GET",localStroage.host+"/action/"+action);
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

	return data;
}
,{
	urls: ["<all_urls>"]
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	isListening = msg.listening;
	if( !msg.listening ){
		get("stop");
	}
});
