//
//
//

// detector

function HumanDetector(options) {
	this._storage = options === undefined || options.storage === false ? undefined : options.storage;
	this.hasDetected = {
		mouse: false,
		keyboard: false,
		touch: false,
		any: false
	};
	this._subscribers = [];
	if (options !== undefined && options.subscriber !== undefined) {
		this._subscribers.push(options.subscriber);
	}

	if (this._storage !== undefined) {
		this._readStorage();
		if (this.hasDetected.any) {
			this._broadcast();
		}
	}

	this._start();
}

HumanDetector.prototype._readStorage = function() {
	if (this._storage && this._storage["HumanDetector"]) {
		this.hasDetected.mouse = this._storage["HumanDetector"][0] === "1";
		this.hasDetected.keyboard = this._storage["HumanDetector"][1] === "1";
		this.hasDetected.touch = this._storage["HumanDetector"][2] === "1";
		this.hasDetected.any = this.hasDetected.mouse || this.hasDetected.keyboard || this.hasDetected.touch;
	}
};

HumanDetector.prototype._writeToStorage = function() {
	if (this._storage) {
		this._storage["HumanDetector"] = (this.hasDetected.mouse ? "1" : "0") +
			(this.hasDetected.keyboard ? "1" : "0") + 
			(this.hasDetected.touch ? "1" : "0");
	}
};

HumanDetector.prototype._broadcast = function() {
	for (var x = 0; x < this._subscribers.length; x++) {
		this._subscribers[x](this);
	}
};

HumanDetector.prototype._newDetection = function() {
	this.hasDetected.any = this.hasDetected.mouse || this.hasDetected.keyboard || this.hasDetected.touch;
	this._writeToStorage();
	this._broadcast();
};

HumanDetector.prototype._start = function() {
	if (!this.hasDetected.mouse) {
		this._addEventListener(document, "mousemove", this._mouseDetected);
	}
	if (!this.hasDetected.keyboard) {
		this._addEventListener(document, "keydown", this._keyboardDetected);
	}
	if (!this.hasDetected.touch) {
		this._addEventListener(document, "touchmove", this._touchDetected);
		this._addEventListener(document, "touchstart", this._touchDetected);
	}
};

HumanDetector.prototype._mouseDetected = function() {
	this.hasDetected.mouse = true;
	this._newDetection();
	this._removeEventListener(document, "mousemove", this._mouseDetected);
};

HumanDetector.prototype._keyboardDetected = function() {
	this.hasDetected.keyboard = true;
	this._newDetection();
	this._removeEventListener(document, "keydown", this._keyboardDetected);
};

HumanDetector.prototype._touchDetected = function() {
	this.hasDetected.touch = true;
	this._newDetection();
	this._removeEventListener(document, "touchmove", this._touchDetected);
	this._removeEventListener(document, "touchstart", this._touchDetected);
};
	
HumanDetector.prototype._addEventListener = function(element, event, handler) {
	if (element.addEventListener) {
		element.addEventListener(event, handler, false);
	}
	else {
		element.attachEvent("on" + event, handler);
	}
};
	
HumanDetector.prototype._removeEventListener = function(element, event, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(event, handler);
	}
	else {
		element.detachEvent("on" + event, handler);
	}
};


//
//
//

// visit handler
var SimpleWebsiteVisitStatistics = {};

SimpleWebsiteVisitStatistics.endpointUrl = document.querySelector("[data-swvs-endpoint]") ? document.querySelector("[data-swvs-endpoint]").getAttribute("data-swvs-endpoint") : window.console ? window.console.log("Error! No element matching [[data-swvs-endpoint] found") : "";

SimpleWebsiteVisitStatistics.saveNew = function() {
	// create new visit
	var newVisit = {
		href: window.location.href,
		referrer: document.referrer,
		width: window.innerWidth
	};

	// read cache
	var cache = [];
	try {
		cache = JSON.parse(window.sessionStorage["SimpleWebsiteVisitStatistics"]);
	}
	catch {}

	// add new to cache and save to persistent storage
	cache.push(newVisit);
	window.sessionStorage["SimpleWebsiteVisitStatistics"] = JSON.stringify(cache);
};

SimpleWebsiteVisitStatistics.pushCache = function() {
	// read cache
	var cache = [];
	try {
		cache = JSON.parse(window.sessionStorage["SimpleWebsiteVisitStatistics"]);
	}
	catch {}

	// current time (ms)
	var time = (new Date()).getTime();

	if (cache.length > 0) {
		var postData = [];
		for (var x = 0; x < cache.length; x++) {
			// if not sent before or sent (and failed) more than 30 seconds ago
			if (cache[x].sent === undefined || time - cache[x].sent > 30000) {
				postData.push("href[]=" + encodeURIComponent(cache[x].href));
				// add current time to be able to check timeout and be able to remove from cache on success
				cache[x].sent = time;
			}
		}

		// might be that we got nothing to send
		if (postData.length === 0) {
			return;
		}

		// add data which is true for every visit
		postData.push("lang=" + encodeURIComponent(navigator.language || navigator.browserLanguage || navigator.userLanguage));

		// make the post
		var ajax = new XMLHttpRequest();
		ajax.open("POST", SimpleWebsiteVisitStatistics.endpointUrl, true);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		ajax.onload = function() { SimpleWebsiteVisitStatistics.pushSuccessHandler(time); };
		ajax.send(postData.join("&"));

		// save cache to persistent storage again (because we set the "sent" value on the items)
		window.sessionStorage["SimpleWebsiteVisitStatistics"] = JSON.stringify(cache);
	}
};

SimpleWebsiteVisitStatistics.pushSuccessHandler = function(time) {
	// read cache
	var cache = [];
	try {
		cache = JSON.parse(window.sessionStorage["SimpleWebsiteVisitStatistics"]);
	}
	catch {}

	// remove matching
	for (var x = 0; x < cache.length; x++) {
		if (cache[x].sent !== undefined && cache[x].sent === time) {
			cache.splice(x, 1);
			x--;
		}
	}

	// save to persistent storage
	window.sessionStorage["SimpleWebsiteVisitStatistics"] = JSON.stringify(cache);
};

//
//
//

// Here is the app logic
SimpleWebsiteVisitStatistics.saveNew();

new HumanDetector({
	storage: window.localStorage,
	subscriber: function (humanDetector) {
		if (humanDetector.hasDetected.any) {
			SimpleWebsiteVisitStatistics.pushCache();
		}
	}
});

//
//
//

