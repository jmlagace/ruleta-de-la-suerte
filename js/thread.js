
/* ______________________________________________________________________

	Thread Class
	This class creates a Timer based thread* for JS code execution.

	Requires: Mootools 1.2

	License: MIT License

	Author:
	eneko.alonso@gmail.com
	http://enekoalonso.com

	* Javascript is simple-threaded. Thus, there is no way to create
	a thread in javascript. Instead, this class emulates the behavior
	of a thread, running on its own with a timer interval.
   ______________________________________________________________________
*/

ThreadController = {
	threadCount: 0,
	threads: [],
	add: function(thread) {
		this.threads.push(thread);
		this.threadCount++;
		thread.threadId = 'Thread-' + this.threadCount;
	},
	count: function() {
		return this.threads.length;
	},
	indexOf: function(ClassName) {
		for (var i=0, l=this.threads.length; i<l; i++) {
			if (this.threads[i].ClassName == ClassName) return i;
		};
		return -1;
	},
	remove: function(index) {
		if (index < 0 || index > this.threads.length-1) return;
		var thread = this.threads.splice(index, 1);
		thread[0].stop();
		delete thread[0];
	}
}

Thread = new Class({
	ClassName: 'Thread',
	// Implements: [Options, Events],
	Implements: Options,

	threadId: '',
	timer: null,
	stopped: true,

	options: {
		interval: 1000,
		autostart: false
	},

	initialize: function(options) {
		ThreadController.add(this);
		this.setOptions(options);
		if (this.options.autostart) this.start();
	},

	start: function() {
		this.stopped = false;
		this.__setTimer();
		// this.fireEvent('start', [this]);
		return this;
	},

	stop: function() {
		this.stopped = true;
		this.__stopTimer();
		// this.fireEvent('stop', [this]);
		return this;
	},

	setInterval: function(time) {
		this.__stopTimer();
		this.options.interval = time;
		this.__setTimer();
		return this;
	},

	// For inheritance
	beforeExecute: function() {
		// this.fireEvent('beforeExecute', [this]);
	},

	// For inheritance
	execute: function() {
		// this.fireEvent('execute', [this]);
	},

	// For inheritance
	afterExecute: function() {
		// this.fireEvent('afterExecute', [this]);
	},

	/* --------------- */

	__setTimer: function() {
		if (!this.stopped) {
			this.__stopTimer();
			// this.timer = setTimeout(function(){
			this.timer = setInterval(function(){
				this.__execute(this);
			}.bind(this), this.options.interval);
		}
	},

	__stopTimer: function() {
		if (this.timer != null) {
			// clearTimeout(this.timer);
			clearInterval(this.timer);
			this.timer = null;
		}
	},

	/* This function is called from a timer which doesn't know about 'this' */
	__execute: function(self) {
		self.beforeExecute();
		self.execute();
		self.afterExecute();
		// self.__setTimer();
	}

});
