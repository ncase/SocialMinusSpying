Social Minus Spying
====

Social sharing buttons that respect your damn privacy.

[Check out the Project Page](http://ncase.github.io/SocialMinusSpying/).
It's a combination demo-documentation-tutorial for using and customizing Social Minus Spying.
With a slight tint of political manifesto and bad programmer humour.
Everything below is just a copy-pasted bastardization of its original glory on the Project Page, which you should go visit, instead of reading to the end of this sentence, right now, seriously.

<hr>

Quick Start
---

1) Download [S-S.js](https://raw.github.com/ncase/SocialMinusSpying/master/S-S.js), and include it in the head of your web page.
	
    <script src="S-S.js"></script>

2) Insert the following snippet where you want your social buttons:

    <div class="s-s" data-type="facebook"></div>
    <div class="s-s" data-type="twitter"></div>

3) That's it! Your social sharing buttons are now more customizeable, more lightweight, and give a damn about Your Damn Privacy (TM).

<hr>

How To Customize
---

**1) Customizing links, labels, and share description.**

You can change the text and links of a share button simply by adding data- attributes to the HTML.

	<div class="s-s" 
		data-type="twitter" 
		data-link="http://www.catlateraldamage.com/" 
		data-label="you've cat to be kitten me right meow" 
		data-text="A first-person destructive cat simulator">
	</div>


**2) Customizing styles.**

Because the share button is not inside an external iframe, you can directly modify its look simply by including a stylesheet! (protip: give the buttons id's to change their styles individually)

	<style>
	#please_dont_do_this{
		font-family:"Comic Sans MS";
		border-radius: 50px;
	}
	#please_dont_do_this #ss_label{
		background: url(img/rainbow.png);
	}
	</style>
	<div id="please_dont_do_this" class="s-s"
		data-type="facebook"
		data-link="http://zombo.com/">
	</div>


You can also pass in an HTML template as a data- attribute. Here's a template for a very minimalist Twitter Share button.

	<div class="s-s"
		data-type="twitter"
		data-text="Shake Vigorously"
		data-link="http://www.staggeringbeauty.com/"
		data-template="<a target='_blank' href='https://twitter.com/share?url={{link}}&text={{text}}'>tweet vigorously</a> ({{count}})">
	</div>


**3) Customizing APIs.**

Whether it's requesting different stats, or building a social share button for a completely different site, or making a button that calls an API that only returns the number "8"... you can easily extend S-S to fit your needs.
To show this in action, heres' the code for a button that calls an API that only returns the number "8".
The "API" in question is just [a JSON file I posted on Pastebin](http://pastebin.com/raw.php?i=eBHzdqUP).
To change the requests, I create a new config object in the global object, `SS_SOCIAL_API`, like so:

	<script>
	window.SS_SOCIAL_API.stanley = {
		template: "<button style='font-size:30px' onclick='alert({{count}})'>{{label}}</button>",
		label: "The Stanley Parable Demo",
		requestURI: "http://pastebin.com/raw.php?i=eBHzdqUP&throwaway=",
		requestProperty: "count"
	};
	</script>
	<div class="s-s" data-type="stanley"></div>

<hr>

How It Protects Privacy
---

**1) Proxy server calls**

To see how many times a link has been shared, you can call the Facebook/Twitter APIs.

Twitter - [urls.api.twitter.com/1/urls/count.json?url={{URL}}](http://urls.api.twitter.com/1/urls/count.json?url=https://www.youtube.com/watch?v=vtkGtXtDlQA)    
Facebook - [graph.facebook.com/?id={{URL}}](http://graph.facebook.com/?id=https://www.youtube.com/watch?v=vtkGtXtDlQA)

S-S protects your privacy by calling these APIs through a proxy server.
(In fact, it *has* to, because of [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues when it comes to AJAX)
By default, S-S uses the open source [JSONProxy](http://jsonp.jit.su/),
and if you want, you can easily customize S-S to use a different proxy:

	<script> window.SS_PROXY_SERVER = "http://{{ALTERNATIVE_CORS_PROXY}}/?url="; </script>



**2) Static share links**

The standard sharing widgets load up external iframes and set cookies in your browser, even if you're not logged in. Yeesh. In contrast, the one and only time S-S loads up Facebook/Twitter is when you click to share on Facebook/Twitter. Otherwise, it remains static and can't track you. When you want to share, S-S opens a popup to these links:

Twitter - [twitter.com/share?url={{link}}&text={{text}}](https://twitter.com/share?url=https://www.youtube.com/watch?v=vtkGtXtDlQA&text=The%20sequel%20to%20Don%27t%20Hug%20Me%20I%27m%20Scared?%20It%27s%20about%20TIME!)    
Facebook - [www.facebook.com/sharer/sharer.php?u={{link}}&t={{text}}](https://www.facebook.com/sharer/sharer.php?u=https://www.youtube.com/watch?v=vtkGtXtDlQA&t=The%20sequel%20to%20Don%27t%20Hug%20Me%20I%27m%20Scared?%20It%27s%20about%20TIME!)

If you don't care about Share Counts or having a popup, you can avoid using S-S altogether and just use these links by themselves:

	<a href="https://twitter.com/share?url=http://dmatthams.co.uk/gwd/&text=Wowwee, this was made in Google Web Designer!" target="_blank">Tweet about GWD</a>


**3) Being open & customizeable**

All of this would be pointless if you couldn't freely use, examine, and modify my code.
S-S is dedicated to the public domain using the [Unlicense](http://unlicense.org/).
With the code being open to the public, you can glance through my fairly short code
(under 200 lines with whitespace and comments), and make sure it really does protect your privacy.

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

Yup. Nothing suspicious there. 

<hr>

Conclusion
---

I love sharing information! But I should have control over what I share.

That control over your generosity is the difference between letting a friend crash at your place, and them breaking into your apartment... then raiding your fridge for cookies, leaving a personalized ad for Oreos, and exiting through a backdoor that they secretly installed in everyone's houses.

I'll be the first to admit, S-S isn't particularly complicated or clever or new. But that's exactly the point. It doesn't take that much extra effort to make the web a safer place, so we developers should do whatever we can to help, no matter how small.

How will you respect Your Damn Privacy (TM) today? 

<hr>

Credits
---

All code and text here has [Zero Rights Reserved](http://unlicense.org/).
Created by [@ncasenmare](https://twitter.com/ncasenmare).

I'm also making an open source HTML5 game called [Nothing To Hide](http://nothingtohide.cc/),    
an anti-stealth game where you are your own watchdog.

Thank you for reading! 