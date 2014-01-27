(function(){

	// CONFIGURATION
	var PROXY_SERVER = "http://jsonp.jit.su/?url=";

	// When the page is done loading, convert all S-S divs to share buttons
	window.addEventListener("load",function(){
		var shareButtons = document.querySelectorAll(".s-s");
		for(var i=0;i<shareButtons.length;i++){
			convertToButton(shareButtons[i]);
		}
	},false);

	// Convert a placeholder S-S div to a share button
	var converters = {};
	var convertToButton = function(dom){

		// Get converter function
		var type = dom.getAttribute("data-type");
		var converter = converters[type];
		if(!converter) return;

		// Get social share config
		var link = dom.getAttribute("data-href") || window.location.href;
		var text = dom.getAttribute("data-text") || document.head.getElementsByTagName("title")[0].innerHTML;
		var label = dom.getAttribute("data-label");
		var template = dom.getAttribute("data-template");
		var config = {
			link: encodeURIComponent(link),
			text: encodeURIComponent(text),
			label: label,
			template: template
		};

		// Convert to share button
		converter(dom,config);

	};

	// Get share count: Make API request, get property of JSON response, pass to callback.
	var getShareCount = function(request,property,callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET",PROXY_SERVER+request);
		xhr.onreadystatechange = function() {
			if(xhr.readyState===4 && xhr.status===200){
				var response = JSON.parse(xhr.responseText);
				var count = response[property] || 0;
				callback(count);
			}
		};
		xhr.send();
	};

	// Lightweight templating
	var generateHTML = function(config){
		var html = config.template;
		for(var name in config){
			var value = config[name];
			html = html.replace("{{"+name+"}}",value,"g");
		}
		return html;
	};

	// Convert to Twitter button
	converters.twitter = function(dom,config){

		// Default Properties
		config.label = config.label || "Tweet";
		config.template = config.template ||
			"<a href='https://twitter.com/share?url={{link}}&text={{text}}' target='_blank'>{{label}}</a> - {{count}}";

		// Get Share Count asynchronously
		getShareCount("http://urls.api.twitter.com/1/urls/count.json?url="+config.link, "count", function(count){
			config.count = count;
			dom.innerHTML = generateHTML(config);
		});

	};

	// Convert to Facebook button
	converters.facebook = function(dom,config){

		// Default Properties
		config.label = config.label || "Share";
		config.template = config.template ||
			"<a href='https://www.facebook.com/sharer/sharer.php?u={{link}}&t={{text}}' target='_blank'>{{label}}</a> - {{count}}";

		// Get Share Count asynchronously
		getShareCount("http://graph.facebook.com/?id="+config.link, "shares", function(count){
			config.count = count;
			dom.innerHTML = generateHTML(config);
		});

	};

})();