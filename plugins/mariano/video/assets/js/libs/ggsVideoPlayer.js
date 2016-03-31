/**
 * GGS Video Player<br>
 * IDs are used for JavaScript, classes for styling. Don't mix them! Every element that can be styled has a class (same name as the ID).
 * @namespace ggsVideoPlayer
 */
var ggsVideoPlayer = function(cfg){

	/**
	 * Variables
	 */
	var supportsVideo = !!document.createElement('video').canPlayType,
		jQuerySupport = typeof jQuery === 'function' ? true : false,
		playerOpen = false,
		videoElm,
		videoControlsElm,
		fullScreenActive = false,
		overlayElm,
		videoPlayerElm,
		pauseOnVideoElm,
		loadingElm,
		currentBreakpoint = 0,
		initialized = false,
		body = document.getElementsByTagName('body')[0],
		suffix = cfg.suffix || '',
		pauseOnVideoHtml = '<div id="ggs-video-playpause-overlay' + suffix + '" class="ggs-video-playpause-overlay"><div id="ggs-video-playpause-onvideo' + suffix + '" class="ggs-video-playpause-onvideo"></div></div>',
		loadingHtml = '<div id="ggs-video-loader' + suffix + '" class="ggs-video-loader"></div>',
		controlStrings = {
			play: '<button type="button" id="ggs-video-play' + suffix + '" class="ggs-video-play"></button>',
			pause: '<button type="button" id="ggs-video-pause' + suffix + '" class="ggs-video-pause"></button>',
			playpause: '<button type="button" id="ggs-video-playpause' + suffix + '" class="ggs-video-playpause"></button>',
			mute: '<button type="button" id="ggs-video-mute' + suffix + '" class="ggs-video-mute"></button>',
			volumeDown: '<button type="button" id="ggs-video-volume-down' + suffix + '" class="ggs-video-volume-down"></button>',
			volumeUp: '<button type="button" id="ggs-video-volume-up' + suffix + '" class="ggs-video-volume-up"></button>',
			volumeSlider: '<input id="ggs-video-volume-slider' + suffix + '" class="ggs-video-volume-slider" type="range" min="0" max="100" value="100" step="1">',
			progressBar: '<progress id="ggs-video-progress' + suffix + '" class="ggs-video-progress" value="0" min="0"><span id="ggs-video-progress-bar' + suffix + '" class="ggs-video-progress"></span></progress>',
			fullscreen: '<button type="button" id="ggs-video-fullscreen' + suffix + '" class="ggs-video-fullscreen"></button>',
			close: '<button type="button" id="ggs-video-close' + suffix + '" class="ggs-video-close"></button>',
			time: '<div id="ggs-video-time-wrapper' + suffix + '" class="ggs-video-time-wrapper"><span id="ggs-video-time-current' + suffix + '" class="ggs-video-time-current">0:00</span><span id="ggs-video-time-slash' + suffix + '" class="ggs-video-time-slash">/</span><span id="ggs-video-time-duration' + suffix + '" class="ggs-video-time-duration">0:00</span></div>'
		},
		controlCfg,
		me,
		breakpoints,
		videoDuration,
		videoTime,
		debug,
		autoplay,
		loop,
		htmlContainer,
		overlay,
		startFullscreen,
		fallback,
		fallbackUrl,
		pauseOnVideo,
		muted,
		format,
		loading,
		keyboard,
		url,
		height,
		width,
		customControls,
		controlElements,
		poster,
		preload,
		openCallback,
		closeCallback,
		playCallback,
		pauseCallback,
		muteCallback,
		playingCallback,
		finishCallback,
		loadeddataCallback,
		canplaythroughCallback,


	/**
	 * Video player initialization
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	init = function(){
		/** Open the player if it has been initialized before */
		if (initialized) {
			me.openPlayer();
			return false;
		}

		initialized = true;

		debug = cfg.debug || false;

		log('-- Video play initialisation');
		log('cfg:', cfg);

		/** Save options */
		autoplay = cfg.autoplay !== undefined ? cfg.autoplay : true;    /** True by default */
		muted = cfg.muted;                                              /** False by default */
		htmlContainer = cfg.htmlContainer;
		pauseOnVideo = cfg.pauseOnVideo !== undefined ? cfg.pauseOnVideo : true;
		loading = cfg.loading !== undefined ? cfg.loading : true;
		overlay = cfg.overlay !== undefined ? cfg.overlay : true;
		loop = cfg.loop;
		startFullscreen = cfg.startFullscreen;
		keyboard = cfg.keyboard;
		breakpoints = cleanUpBreakpoints();
		url = removeFileEndingFromUrl(cfg.video.url);
		fallback = cfg.video.fallback || '';
		fallbackUrl = cfg.video.fallbackUrl || '';
		height = setVideoSize('height');
		width = setVideoSize('width');
		format = setVideoFormat();
		customControls = cfg.controls !== undefined && cfg.controls !== true ? true : false;
		controlElements = customControls ? cfg.controls : {};
		poster = cfg.video.poster;
		preload = setPreloadValue();
		openCallback = cfg.onOpen;
		closeCallback = cfg.onClose;
		playCallback = cfg.onPlay;
		pauseCallback = cfg.onPause;
		muteCallback = cfg.onMute;
		playingCallback = cfg.onPlaying;
		finishCallback = cfg.onFinish;
		loadeddataCallback = cfg.onFirstFrameLoaded;
		canplaythroughCallback = cfg.onCanPlayThrough;

		log('- Options');
		log('autoplay:', autoplay);
		log('htmlContainer:', htmlContainer);
		log('overlay:', overlay);
		log('startFullscreen:', startFullscreen);
		log('url:', url);
		log('fallback:', fallback);
		log('fallbackUrl:', fallbackUrl);
		log('height:', height);
		log('width:', width);
		log('format:', format);
		log('customControls:', customControls);
		log('controlElements:', controlElements);
		log('poster:', poster);
		log('preload:', preload);
		log('muted:', muted);
		log('loading:', loading);
		log('pauseOnVideo:', pauseOnVideo);
		log('suffix:', suffix);
		log('loop:', loop);
		log('breakpoints:', breakpoints);

		/** Check the current window size and update the 'currentBreakpoint' variable */
		if (breakpoints) {
			setCurrentBreakpoint();
		}

		/** Create and append the video player html */
		createPlayerHtml();

		/** Attach some basic event listener */
		overlayElm = document.getElementById('ggs-video-overlay' + suffix);
		videoPlayerElm = document.getElementById('ggs-video-player' + suffix);
		videoElm = document.getElementById('ggs-video' + suffix);
		attachBasicEventListener();
		videoElmEventListener();

		/** Check the browser support for video tag */
		if (!supportsVideo) {
			me.openPlayer();
			return false;
		}

		/** Some html elements */
		videoControlsElm = document.getElementById('ggs-video-controls' + suffix);
		videoTime = document.getElementById('ggs-video-time-current' + suffix);
		videoDuration = document.getElementById('ggs-video-time-duration' + suffix);

		if (pauseOnVideo) {
			pauseOnVideoElm = document.getElementById('ggs-video-playpause-overlay' + suffix);
		}

		if (loading) {
			loadingElm = document.getElementById('ggs-video-loader' + suffix);
		}

		/** Video controls */
		if (customControls) {
			/** Hide the default controls */
			videoElm.controls = false;

			/** Display the user defined video controls */
			videoControlsElm.style.display = 'block';

			/** Event listener for the control elements */
			attachControlEventListener();
		}

		/** Mute the video if enabled */
		if (muted) {
			me.muteVideo();
		}

		/** Fullscreen event listener */
		if (controlElements.fullscreen) {
			fullscreenSetup();
		}

		/** Video playing callbacks */
		if (playingCallback) {
			addListener(videoElm, 'playing', function(){
				playingCallback();
			});
		}

		/** Show the player */
		me.openPlayer();
	},


	/**
	 * Attach event listener for video control elements
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	attachControlEventListener = function(){
		controlCfg = {
			play: {
				elm: document.getElementById('ggs-video-play' + suffix),
				eventType: 'click',
				callback: me.playVideo
			},
			pause: {
				elm: document.getElementById('ggs-video-pause' + suffix),
				eventType: 'click',
				callback: me.pauseVideo
			},
			playpause: {
				elm: document.getElementById('ggs-video-playpause' + suffix),
				eventType: 'click',
				callback: playpauseVideo
			},
			mute: {
				elm: document.getElementById('ggs-video-mute' + suffix),
				eventType: 'click',
				callback: me.muteVideo
			},
			volumeDown: {
				elm: document.getElementById('ggs-video-volume-down' + suffix),
				eventType: 'click',
				callback: volumeDown
			},
			volumeUp: {
				elm: document.getElementById('ggs-video-volume-up' + suffix),
				eventType: 'click',
				callback: volumeUp
			},
			volumeSlider: {
				elm: document.getElementById('ggs-video-volume-slider' + suffix),
				eventType: 'change',
				callback: volumeSlider
			},
			progressBar: {
				elm: document.getElementById('ggs-video-progress' + suffix)
			},
			fullscreen: {
				elm: document.getElementById('ggs-video-fullscreen' + suffix)
			},
			close: {
				elm: document.getElementById('ggs-video-close' + suffix),
				eventType: 'click',
				callback: me.closePlayer
			},
			time: {
				elm: document.getElementById('ggs-video-time-wrapper' + suffix)
			}
		};

		/** Attach all the events but only if the control element is activated */
		for (var i in controlElements) {
			if (controlElements[i] && controlCfg[i].eventType && controlCfg[i].callback) {
				addListener(controlCfg[i].elm, controlCfg[i].eventType, controlCfg[i].callback);
			}
		}

		/** Update the progress bar */
		if (controlElements.progressBar) {
			var lastTime = 0,
				progress = controlCfg.progressBar.elm,
				progressBar = document.getElementById('ggs-video-progress-bar' + suffix);

			addListener(videoElm, 'timeupdate', function(){

				// play image shown when the video ends
				if(videoElm.ended) {
					//playpause.className = 'play';
				}

				/** Needed for some mobile browsers */
				if (!progress.getAttribute('max')) {
					progress.setAttribute('max', videoElm.duration);
				}

				/** Update progress bar */
				progress.value = videoElm.currentTime;
				progressBar.style.width = Math.floor((videoElm.currentTime / videoElm.duration) * 100) + '%';

				/** Update current time in mm:ss format */
				videoTime.innerHTML = toHHMMSS(videoElm.currentTime);
				videoDuration.innerHTML = toHHMMSS(videoElm.duration);

				/** Loading indicator */
				lastTime = videoElm.currentTime;
				window.setTimeout(function(){
					if (lastTime === videoElm.currentTime && videoElm.currentTime !== videoElm.duration && !videoElm.paused) {
						if (loading) {
							loadingElm.className += 'loading';
						}
					} else{
						if (loading) {
							loadingElm.className = loadingElm.className.replace(/ loading/g, '');
						}
					}
				}, 500);
			});

			addListener(progress, 'click', function(event){
				jumpTo(progress, event);
			});

			addListener(progressBar, 'click', function(event){
				jumpTo(progressBar, event);
			});
		}

		/** Play/Pause on video */
		if (pauseOnVideo) {
			addListener(pauseOnVideoElm, 'click', function(){
				playpauseVideo();
			});
		}
	},


	/**
	 * Attach some basic event listener
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	attachBasicEventListener = function(){
		/** Click event handler for closing the player (overlay) */
		if (overlay) {
			addListener(overlayElm, 'click', function(){
				me.closePlayer();
			});
		}

		/** Keyboard events */
		if (keyboard && overlay) {
			document.onkeydown = function(event){
				/** IE does not pass the event object */
				event = event || window.event;

				/** Esc */
				if (event.keyCode === 27) {
					me.closePlayer();
				}
			};
		}

		/** Window resize listener */
		if (breakpoints) {
			window.onresize = function(){
				if (setCurrentBreakpoint()) {
					updateVideo();
				}
			};
		}
	},


	/**
	 * Attach event listener for the video element
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	videoElmEventListener = function() {
		if (customControls && controlElements.progressBar) {
			/** Set the progressbar max value */
			addListener(videoElm, 'loadedmetadata', function(){
				controlCfg.progressBar.elm.setAttribute('max', videoElm.duration);
			});
		}

		/** Loading indicator */
		addListener(videoElm, 'loadstart', function(){
			if (loading) {
				loadingElm.className += ' ggs-video-loading';
			}
		});

		addListener(videoElm, 'loadeddata', function(){
			if (loading) {
				loadingElm.className = loadingElm.className.replace(/ ggs-video-loading/g, '');
			}

			if (loadeddataCallback) {
				loadeddataCallback();
			}
		});

		addListener(videoElm, 'canplaythrough', function(){
			if (canplaythroughCallback) {
				canplaythroughCallback();
			}
		});

		/** Video finished callback */
		addListener(videoElm, 'ended', function() {
			if (loop) {
				me.playVideo();
			} else {
				me.stopVideo();
			}
			if (finishCallback) {
				finishCallback();
			}
		});
	},


	/**
	 * Start/stop playing the video
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	playpauseVideo = function(){
		if (videoElm.paused || videoElm.ended) {
			me.playVideo();
		} else {
			me.pauseVideo();
		}
	},


	/**
	 * Increase the video volume
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	volumeUp = function(){
		alterVolume('+');
	},


	/**
	 * Decrease the video volume
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	volumeDown = function(){
		alterVolume('-');
	},


	/**
	 * HTML5 'range' input slider
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	volumeSlider = function(){
		videoElm.volume = controlCfg.volumeSlider.elm.value / 100;
		if(volumeSlider.value === 0) {
			controlCfg.mute.elm.className = 'mute';
		}
		else {
			controlCfg.mute.elm.className = 'sound';
		}
	},


	/**
	 * Alter the video volume
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	alterVolume = function(dir){
		var currentVolume = Math.floor(videoElm.volume * 10) / 10;
		if (dir === '+') {
			if (currentVolume < 1) {
				videoElm.volume += 0.1;
			}
		} else if (dir === '-') {
			if (currentVolume > 0) {
				videoElm.volume -= 0.1;
			}
		}
	},


	/**
	 * Jump to a spo the video volume
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param {DOM-element} elm The dom node ('span' or 'progress' element)
	 * @param {event} event The click event
	 */
	jumpTo = function(elm, event){
		var pos = ((event.pageX || event.clientX) - elm.offsetLeft - videoPlayerElm.offsetLeft) / elm.offsetWidth;
		videoElm.currentTime = pos * videoElm.duration;
	},


	/**
	 * Compose and insert the video player html
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	createPlayerHtml = function(){
		var overlayHtml = overlay ? '<div id="ggs-video-overlay' + suffix + '" class="ggs-video-overlay"></div>' : '',
			videoHtml = '<div id="ggs-video-player' + suffix + '" class="ggs-video-player">' +
							getVideoHtml() +
							(pauseOnVideo && supportsVideo ? pauseOnVideoHtml : '') +
							(loading && supportsVideo ? loadingHtml : '') +
							'<div id="ggs-video-controls' + suffix + '" class="ggs-video-controls">' +
								getVideoControlsHtml() +
							'</div>' +
						'</div>';

		if (jQuerySupport && htmlContainer instanceof jQuery) {
			htmlContainer = htmlContainer[0];
		}

		if (htmlContainer) {
			htmlContainer.insertAdjacentHTML('beforeend', overlayHtml + videoHtml);
			
		} else {
			body.insertAdjacentHTML('beforeend', overlayHtml + videoHtml);
		}
	},


	/**
	 * Compose the video element html
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @return {string} Video element html
	 */
	getVideoHtml = function(){
		var posterHtml = poster ? ' poster="' + poster + '"' : '',
			videoHtml = '<video class="ggs-video' + (breakpoints ? ' ggs-video-' + currentBreakpoint : '') + '" id="ggs-video' + suffix + '"' +
							(customControls ? '' : ' controls') +
							' preload="' + preload + '"' +
							posterHtml +
							' width="' + width + '"' +
							' height="' + height + '"' +
							(autoplay ? ' autoplay' : '') +'>' +
							getSourceHtml() +
							getFallbackHtml() +
						'</video>';
		return videoHtml;
	},


	/**
	 * Remove the old video element and append the new one
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	updateVideo = function(){
		var videoHtml = getVideoHtml();
		
		/** Remove old video element */
		videoPlayerElm.removeChild(videoElm);

		/** Append new video element */
		videoPlayerElm.insertAdjacentHTML('afterbegin', videoHtml);

		videoElm = document.getElementById('ggs-video' + suffix);

		videoElmEventListener();
	},


	/**
	 * Get the video formats html string
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @return {string} Video formats html
	 */
	getSourceHtml = function(){
		var html = '';
		for (var i=0; i<format.length; i++) {
			html += '<source src="' + (breakpoints ? breakpoints[currentBreakpoint].url : url) + '.' + format[i] + '" type="video/' + format[i] + '">';
		}
		return html;
	},


	/**
	 * Get the fallback image/video html string
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @return {string} Fallback html
	 */
	getFallbackHtml = function(){
		if (breakpoints) {
			return '<img class="ggs-video-img" width="100%" height="100%" src="' + breakpoints[currentBreakpoint].fallbackUrl + '">';
		} else {
			switch (fallback) {
				case 'youtube':
					return '<iframe class="ggs-video-iframe" width="100%" height="100%" src="' + fallbackUrl + '" frameborder="0"' + (cfg.controls.fullscreen ? ' allowfullscreen' : '') +'></iframe>';
				case 'image':
					return '<img class="ggs-video-img" width="100%" height="100%" src="' + fallbackUrl + '">';
				default:
					return '';
			}
		}
	},


	/**
	 * Get the video controls html string
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @return {string} Video controls html
	 */
	getVideoControlsHtml = function(){
		if (!customControls) {
			return '';
		} else {
			var controlHtml = '';
			for (var i in controlElements) {
				if (controlElements[i]) {
					controlHtml += controlStrings[i];
				}
			}
			return controlHtml;
		}
	},


	/**
	 * Setup the fullscreen functionality
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	fullscreenSetup = function(){
		var fullScreenEnabled = !!(document.fullscreenEnabled || 
									document.mozFullScreenEnabled || 
									document.msFullscreenEnabled || 
									document.webkitSupportsFullscreen || 
									document.webkitFullscreenEnabled || 
									document.createElement('video').webkitRequestFullScreen);

		addListener(controlCfg.fullscreen.elm, 'click', function(){
			if (fullScreenEnabled) {
				handleFullscreen();
			/** Fullscreen fallback */
			} else {
				if (!fullScreenActive) {
					videoPlayerElm.className += ' ggs-video-fullscreen';
					fullScreenActive = true;
				} else {
					videoPlayerElm.className = videoPlayerElm.className.replace(/ ggs-video-fullscreen/g, '');
					fullScreenActive = false;
				}
			}
		});

		addListener(document, 'fullscreenchange', function(){
			setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
		});
		addListener(document, 'webkitfullscreenchange', function(){
			setFullscreenData(!!document.webkitIsFullScreen);
		});
		addListener(document, 'mozfullscreenchange', function(){
			setFullscreenData(!!document.mozFullScreen);
		});
		addListener(document, 'msfullscreenchange', function(){
			setFullscreenData(!!document.msFullscreenElement);
		});
	},


	/**
	 * Handles the fullscreen mode
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	handleFullscreen = function(){
		if (isFullScreen()) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
			else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}
			else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
			else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			setFullscreenData(false);
		} else {
			if (videoElm.requestFullscreen) videoElm.requestFullscreen();
			else if (videoElm.mozRequestFullScreen) videoElm.mozRequestFullScreen();
			else if (videoElm.webkitRequestFullScreen) videoElm.webkitRequestFullScreen();
			else if (videoElm.msRequestFullscreen) videoElm.msRequestFullscreen();
			setFullscreenData(true);
		}
	},


	/**
	 * Check fullscreen browser support
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	isFullScreen = function(){
		return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
	},


	/**
	 * Set fullscreen data attribute
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	setFullscreenData = function(state){
		videoElm.setAttribute('data-fullscreen', !!state);
	},


	/**
	 * Console logging if debug is enabled and browser supports it. For opera it throws the opera counterpart, in older IE an alert.
	 * @memberOf ggsVideoPlayer
	 * @private
	 */
	log = function(){
		if (debug) {
			try {
				console.log.apply(console, arguments);
			}
			catch(e) {
				try {
					opera.postError.apply(opera, arguments);
				}
				catch(event) {
					alert(Array.prototype.join.call( arguments, " "));
				}
			}
		}
	},


	/**
	 * Will return the video size in px or %
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param {string} value Can be 'height' or 'width'
	 * @returns {string} The video size
	 */
	setVideoSize = function(value){
		var size = cfg.video[value];
		if (typeof size === 'number') {
			return size + 'px';
		} else if (typeof size === 'string') {
			return size;
		} else {
			return 'auto';
		}
	},
	

	/**
	 * Will return the video formats
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @returns {array} The needed video formats
	 */
	setVideoFormat = function(){
		var format = cfg.video.format;
		if (typeof format === 'object') {
			return format;
		} if (typeof format === 'string') {
			return [format];
		} else {
			return ['mp4', 'webm', 'ogg'];
		}
	},


	/**
	 * Will remove the file ending
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param {string} urlToCheck The url that needs to be checked.
	 * @returns {string} The url
	 */
	removeFileEndingFromUrl = function(urlToCheck){
		var newUrl = urlToCheck || '';
		newUrl = newUrl.replace(/(.webm$|.mp4$|.ogg$)/g, '');
		return newUrl;
	},


	/**
	 * Will remove the file ending from every url in breakpoints list
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @returns {object} The cleaned up breakpoints configuration
	 */
	cleanUpBreakpoints = function(){
		if (cfg.video.breakpoints) {
			for (var i in cfg.video.breakpoints) {
				cfg.video.breakpoints[i].url = removeFileEndingFromUrl(cfg.video.breakpoints[i].url);
			}
		}
		return cfg.video.breakpoints;
	},


	/**
	 * Check the current browser width and set the 'currentBreakpoint' variable if the breakpoint is not the current one
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @returns {boolean} True if a new breakpoint was chosen
	 */
	setCurrentBreakpoint = function(){
		var windowWidth = (window.innerWidth || document.documentElement.clientWidth);
		for (var bp in breakpoints) {
			var width = parseInt(bp);
			if (windowWidth <= width) {
				if (currentBreakpoint !== width) {
					currentBreakpoint = width;
					return true;
				}
				break;
			}
		}
		return false;
	},


	/**
	 * Format seconds
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param  {integer} sec Time in seconds
	 * @return {string}      The formatted time
	 */
	toHHMMSS = function (sec){
		var sec_num = Math.round(sec),
			hours   = Math.floor(sec_num / 3600),
			minutes = Math.floor((sec_num - (hours * 3600)) / 60),
			seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time = minutes+':'+seconds;
		return time;
	},


	/**
	 * Checks if events need to be attached on IE-way
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param  {object}  element Element which gets the listener
	 * @return {Boolean}         True for IE, otherwise false
	 */
	isIE = function (element) {
        return element.attachEvent;
    },


    /**
     * Adds a an event of given type to an element (IEs)
     * @memberOf ggsVideoPlayer
	 * @private
     * @param {object}   element  Element which gets the listener
	 * @param {string}   type     Type of the listener (e.g. 'click')
	 * @param {function} callback Event callback
     */
    addListenerIE = function (element, type, callback) {
        element.attachEvent('on' + type, callback);
    },


    /**
     * Adds a an event of given type to an element (non IE browsers)
     * @memberOf ggsVideoPlayer
	 * @private
     * @param {object}   element  Element which gets the listener
	 * @param {string}   type     Type of the listener (e.g. 'click')
	 * @param {function} callback Event callback
     */
    addListenerNotIE = function (element, type, callback) {
        element.addEventListener(type, callback);
    },


	/**
	 * Overwrites itself with either addListenerIE or addListenerNotIE. Its logic is used only the first time it is called.
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @param {object}   element  Element which gets the listener
	 * @param {string}   type     Type of the listener (e.g. 'click')
	 * @param {function} callback Event callback
	 */
    addListener = function (element, type, callback) {

    	if (isIE(element)) {
    		addListener = addListenerIE;
    	}
    	else {
    		addListener = addListenerNotIE;
    	}

    	addListener(element, type, callback);
    },


	/**
	 * Will return the preload value
	 * @memberOf ggsVideoPlayer
	 * @private
	 * @returns {string} The preload value
	 */
	setPreloadValue = function(){
		var preloadVideo = cfg.video.preload;
		/** IE 9 doesn't show the preview image if preload is metadata */
		if (navigator.appVersion.indexOf('MSIE 9.') !== -1) {
			preloadVideo = 'none';
		}
		return preloadVideo || 'metadata';
	};


	/**
	 * Open the video player: ggsVideoPlayer.open();
	 * @memberOf ggsVideoPlayer
	 */
	this.openPlayer = function(){
		if (playerOpen) {
			return false;
		}
		videoPlayerElm.className += ' ggs-video-show';
		if (overlay) {
			overlayElm.className += ' ggs-video-show';
		}
			playerOpen = true;

		/** Callback */
		if (openCallback) {
			openCallback();
		}
	};


	/**
	 * Close the video player: ggsVideoPlayer.close();
	 * @memberOf ggsVideoPlayer
	 */
	this.closePlayer = function(){
		if (!playerOpen) {
			return false;
		}
		if (supportsVideo) {
			me.pauseVideo();
		}
		videoPlayerElm.className = videoPlayerElm.className.replace(/ ggs-video-show/g, '');
		if (overlay) {
			overlayElm.className = overlayElm.className.replace(/ ggs-video-show/g, '');
		}
		playerOpen = false;

		/** Callback */
		if (closeCallback) {
			closeCallback();
		}
	};


	/**
	 * Start playing the video
	 * @memberOf ggsVideoPlayer
	 */
	this.playVideo = function(){
		videoElm.play();
		if (pauseOnVideo) {
			pauseOnVideoElm.className = pauseOnVideoElm.className.replace(/ ggs-video-paused/g, '');
		}

		if (controlElements.play) {
			controlCfg.pause.elm.className = controlCfg.pause.elm.className.replace(/ ggs-video-paused/g, '');
		}

		if (controlElements.playpause) {
			controlCfg.playpause.elm.className = controlCfg.playpause.elm.className.replace(/ ggs-video-paused/g, '');
		}

		/** Callback */
		if (playCallback) {
			playCallback();
		}
	};


	/**
	 * Pause the video
	 * @memberOf ggsVideoPlayer
	 */
	this.pauseVideo = function(){
		videoElm.pause();
		if (pauseOnVideo) {
			pauseOnVideoElm.className += ' ggs-video-paused';
		}

		if (controlElements.pause) {
			controlCfg.pause.elm.className += ' ggs-video-paused';
		}

		if (controlElements.playpause) {
			controlCfg.playpause.elm.className += ' ggs-video-paused';
		}

		/** Callback */
		if (pauseCallback) {
			pauseCallback();
		}
	};


	/**
	 * Stop playing the video
	 * @memberOf ggsVideoPlayer
	 */
	this.stopVideo = function(){
		me.pauseVideo();
		videoElm.currentTime = 0;
		if (controlElements.progressBar) {
			controlCfg.progressBar.elm.value = 0;
		}
	};


	/**
	 * Mute the video
	 * @memberOf ggsVideoPlayer
	 */
	this.muteVideo = function(){
		if (videoElm.muted && controlElements.mute) {
			controlCfg.mute.elm.className = controlCfg.mute.elm.className.replace(/ ggs-video-muted/g, '');
		} else if (controlElements.mute) {
			controlCfg.mute.elm.className += ' ggs-video-muted';
		}
		videoElm.muted = !videoElm.muted;
		if (muteCallback) {
		    muteCallback(videoElm.muted);
		}
	};


	me = this;

	init();

	return me;
};