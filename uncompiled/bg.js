var JSBtnUpdate = function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.storage.sync.get("jsbtn",function(jsbtn){
			var search,pages,i,len;
			
			pages = jsbtn.jsbtn.pages || false;
			if(pages && pages instanceof Array && pages.length){
				search = pages.join("|");
			}else{
				search = "github.com/thefzn|github.com/fznwebdesign";
			}
			search = (search + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
			chrome.declarativeContent.onPageChanged.addRules([
				{
					conditions: [
						new chrome.declarativeContent.PageStateMatcher({
							pageUrl: { urlMatches: search },
						})
					],
					actions: [ new chrome.declarativeContent.ShowPageAction() ]
				}
			]);
		})
	});
}
chrome.runtime.onInstalled.addListener(JSBtnUpdate);