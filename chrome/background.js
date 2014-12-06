var toggle = 0;
var listener = function(data){
	if( data.type.match(/audio|video/) ){
		console.log(data.url);
	}
	if( data.url.match(/mp[34]/i) ){
		console.log(data.url);
	}
	console.log(data);
	return data;

};

chrome.browserAction.onClicked.addListener(function(e) {
	toggle = (toggle+1)%2;
	if( toggle ){
		chrome.webRequest.onResponseStarted.addListener(listener,{
			urls: ["<all_urls>"]
		});
		chrome.browserAction.setTitle({title:"no"});
	}else{
		chrome.webRequest.onResponseStarted.removeListener(listener);
		chrome.browserAction.setTitle({title:"off"});

	}
});
