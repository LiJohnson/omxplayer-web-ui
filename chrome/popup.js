
var updateHost = function(){
	host.value = host.value || localStorage.host || "";
	controller.src = localStorage.host = host.value;
	return false;
}
var updateListening = function(checked){
	listening.checked = checked;
	localStorage.listening = listening.checked;
	chrome.extension.sendMessage({listening: checked},function(){
		
	});

};

form.onsubmit = updateHost;

listening.onchange = function(){
	updateListening(listening.checked);
};

updateListening(localStorage.listening == "true");
updateHost();