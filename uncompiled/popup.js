"use strict"

var JSBtnPopup = {
	data: null,
	init: function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var url = tabs[0].url;
			chrome.storage.sync.get("jsbtn",function(jsbtn){
				var data = jsbtn.jsbtn || false,
					i, len;
				if(!data || !data.def) return;
				if(data.pages && data.pages.length){
					for(i = 0, len = data.pages.length; i < len; i++){
						if(data.pages[i] && data.scripts[i] && url.indexOf(data.pages[i]) >= 0){
							chrome.tabs.executeScript(null,{code:"location.href=\"javascript:"+data.scripts[i].replace(/\"/g,'\\"')+";void(0);\""});
						}
					}
				}
				window.close();
				
			});
			
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
  JSBtnPopup.init();
});