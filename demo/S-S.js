/*
This code is dedicated to the public domain under the Unlicense. <http://unlicense.org>
Created by Nicky Case (@ncasenmare). Attribution is always welcome, but not required!
*/
(function(){

	///////////////////////////
	// DEFAULT CONFIGURATION //
	///////////////////////////

	window.SS_PROXY_SERVER = "http://jsonp.jit.su/?url=";
	window.SS_SOCIAL_API = {
		twitter: {
			template:
				"<div onclick='window.SS_POPUP(\"https://twitter.com/share?url={{link}}&text={{text}}\",\"twitter\")'>"+
				"	<div id='ss_label'>{{label}}</div>"+
				"	<div id='ss_count'>{{count}}</div>"+
				"</div>",
			label: "Share on Twitter",
			requestURI: "http://urls.api.twitter.com/1/urls/count.json?url=",
			requestProperty: "count"
		},	
		facebook: {
			template:
				"<div onclick='window.SS_POPUP(\"https://www.facebook.com/sharer/sharer.php?u={{link}}&t={{text}}\",\"facebook\")'>"+
				"	<div id='ss_label'>{{label}}</div>"+
				"	<div id='ss_count'>{{count}}</div>"+
				"</div>",
			label: "Share on Facebook",
			requestURI: "http://graph.facebook.com/?id=",
			requestProperty: "shares"
		}
	};
	window.SS_STYLE = ""+
		".s-s{ display:inline-block; overflow:hidden; cursor:pointer; }"+
		".s-s #ss_label{ float:left; padding:10px; color:#fff; background:#4099FF; }"+
		".s-s #ss_count{ float:left; padding:10px; color:#000; background:#fff; }"+
		".s-s[data-type='twitter'] #ss_label{ background:#4099FF; }"+
		".s-s[data-type='twitter']:hover #ss_label{ background:#69AFFF; }"+
		".s-s[data-type='facebook'] #ss_label{ background:#3B5998; }"+
		".s-s[data-type='facebook']:hover #ss_label{ background:#5371B1; }";

	// A helper for popup windows
	window.SS_POPUP = function(url,type){

		var w,h;
		switch(type){
			case "twitter": w=550; h=500; break;
			case "facebook": w=670; h=400; break;
			default: w=500; h=500; break;
		}
		var x = (screen.width/2)-(w/2);
  		var y = (screen.height/2)-(h/2);

		var popupConfig = "width="+w+",height="+h+",left="+x+",top="+y+",";
		popupConfig += "resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
		window.open(url,"popup",popupConfig);

	};

	////////////////////////////////////////
	// CREATE SOCIAL MINUS SPYING BUTTONS //
	////////////////////////////////////////

	// Initialize S-S only after the rest of the page loads
	window.addEventListener("load",function(){
	
		// Add stylesheet to top
		var style = document.createElement("style");
		style.innerHTML = SS_STYLE;
		document.head.appendChild(style);

		// Convert all S-S divs to share buttons
		var shareButtons = document.querySelectorAll(".s-s");
		for(var i=0;i<shareButtons.length;i++){
			convertToButton(shareButtons[i]);
		}

		// And, finally...
		notifyTheNSA();

	},false);

	// Convert a placeholder S-S div to a share button
	var convertToButton = function(dom){

		// Get Social API config
		var type = dom.getAttribute("data-type");
		var apiConfig = SS_SOCIAL_API[type];
		if(!apiConfig) return;

		// Config from attribute list
		var config = {};
		for(var i=0; i<dom.attributes.length; i++){
			
			var attr = dom.attributes[i];

			// Is it a data- attribute?
			var name = attr.name;
			var prefixIndex = name.indexOf("data-");
			if(prefixIndex<0) continue;
			name=name.substr(prefixIndex+5);

			// If so, add to config
			config[name] = attr.value;

		}

		// If not specified, override with default Link & Text
		config.link = encodeURIComponent(config.link || window.location.href);
		config.text = encodeURIComponent(config.text || document.head.getElementsByTagName("title")[0].innerHTML);

		// If not specified, override with preset config
		for(var name in apiConfig){
			var value = apiConfig[name];
			if(config[name]) continue;
			config[name] = value;
		}

		// Generate button HTML and insert
		getShareCount(config.requestURI+config.link, config.requestProperty, function(count){
			config.count = count;
			dom.innerHTML = generateHTML(config.template,config);
		});

	};

	// Get share count: Make API request, get property of JSON response, pass to callback.
	var getShareCount = function(request,property,callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET",SS_PROXY_SERVER+request);
		xhr.onreadystatechange = function() {
			if(xhr.readyState===4 && xhr.status===200){
				var response = JSON.parse(xhr.responseText);
				var count = response[property] || 0;
				if(count>10000){
					count = Math.round(count/1000)+"K";
				}else if(count>1000){
					count = ((Math.round(count/100)*100)/1000)+"K";
				}
				callback(count);
			}
		};
		xhr.send();
	};

	// Lightweight templating
	var generateHTML = function(template,config){
		var html = template;
		for(var name in config){
			var value = config[name];
			html = html.replace("{{"+name+"}}",value,"g");
		}
		return html;
	};

	// ha ha
	var notifyTheNSA = function(){
		// I was just kidding, but thank you for reading the source!
		// It's awesome that you like taking a look under the hood.
		// Like minds! :)
	};

})();