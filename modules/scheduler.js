var moment = require("moment");
var fs = require("fs");
/**
 * A Scheduler Module to Fire off tasks
 * @author Brandon Corbin <brandon@icorbin.com>
 * @module scheduled/scheduler
 * @name Scheduler
 */


 	/**
 	 * Scheduler Module - Fires off events at specified times
 	 * Available times:
 	 * Every Minute
 	 * Every 10 Minutes
 	 * Every 15 Minutes
 	 * Every 30 Minutes
 	 * Every Hour
 	 * Every Day
 	 * Every
 	 */

var Scheduler = function (app,config) {
	var self = this;
	var pvt = {
		running: false,
		errors: [],
		interval: null
	};

	self.log = function () {
		console.log(' -- scheduler.js --', arguments);
	};

	/**
	 * Do the Schedule
	 * @param  {string}   folder   Name of the folder to execute all scripts within
	 * @param  {Function} callback err,data response
	 * @return {object}            self
	 */
	pvt.do = function (folder, callback) {
		try {
			var files = fs.readdirSync(config.basepath + 'scheduler/' + folder);
			var events = [];
			for (var i in files) {
				if (files[i].match('.js') !== null) {
					events.push(require(config.basepath + 'scheduler/' + folder + '/' + files[i])(app));
				}
			}
		}
		catch (e) {
			self.log("ERROR ERROR", e.message, e);
		}
		return self;
	};

	/**
	 * Do all Minute Scheduled Tasks
	 * @param  {Function} callback err,data
	 * @return {object}            self
	 */
	self.do_minute = function (callback) {
		pvt.do('minute', callback);
		return self;
	};

	self.do_variable_minute = function (name, callback) {
		pvt.do('' + name + '_minutes', callback);
		return self;
	};

	/**
	 * Do all hour Scheduled Tasks
	 * @param  {Function} callback err,data
	 * @return {object}            self
	 */
	self.do_hour = function (callback) {
		pvt.do('hour', callback);
		return self;
	};
	/**
	 * Do all day Scheduled Tasks
	 * @param  {Function} callback err,data
	 * @return {object}            self
	 */
	self.do_day = function (callback) {
		pvt.do('day', callback);
		return self;
	};

	self.do_day_name = function (name, callback) {
		pvt.do(name, callback);
		return self;
	};
	/*****************************************************
	 *  SCHEDULER Start
	 ******************************************************/
	/**
	 * Start the Scheduler
	 * @return {object} self
	 */
	self.start = function (autofire) {
		autofire = autofire || false;
		self.log('Starting Scheduler');
		var today = moment();
		if (autofire) {
			today.subtract(1, 'day');
		}
		var times = {
			minute: parseInt(moment(today).format('mm')),
			hour: parseInt(moment(today).format('H')),
			day: parseInt(moment(today).format('D')),
			dayName: (moment(today).format('dddd')),
			five_minute_mark: Math.ceil(parseInt(moment(today).format('mm') / 5).toFixed(0)),
			ten_minute_mark: Math.ceil(parseInt(moment(today).format('mm') / 10).toFixed(0)),
			fifteen_minute_mark: Math.ceil(parseInt(moment(today).format('mm') / 15).toFixed(0)),
			thirty_minute_mark: Math.ceil(parseInt(moment(today).format('mm') / 30).toFixed(0))
		};
		pvt.interval = setInterval(function () {
			var now = {
				minute: parseInt(moment().subtract(1, 'minute').format('mm')),
				hour: parseInt(moment().format('H')),
				day: parseInt(moment().format('D')),
				dayName: (moment().format('dddd')),
				five_minute_mark: Math.ceil(parseInt(moment().format('mm') / 5).toFixed(0)),
				ten_minute_mark: Math.ceil(parseInt(moment().format('mm') / 10).toFixed(0)),
				fifteen_minute_mark: Math.ceil(parseInt(moment().format('mm') / 15).toFixed(0)),
				thirty_minute_mark: Math.ceil(parseInt(moment().format('mm') / 30).toFixed(0))
			};
			if (times.minute != now.minute) {
				console.log('--');
				console.log('SCHEDULER FIRE! - MINUTE');
				console.log('--');
				self.do_minute(function (err, data) {});
				times.minute = now.minute;
			}
			if (times.hour != now.hour) {
				console.log('--');
				console.log('SCHEDULER FIRE! - HOUR');
				console.log('--');
				self.do_hour(function (err, data) {});
				times.hour = now.hour;
			}
			if (times.dayName != now.dayName) {
				console.log('--');
				console.log('SCHEDULER FIRE! - DAY NAME');
				console.log('--');
				self.do_day_name(now.dayName.toLowerCase(), function (err, data) {});
				times.hour = now.hour;
			}
			if (times.ten_minute_mark != now.ten_minute_mark) {
				console.log('--');
				console.log('SCHEDULER FIRE! - 10 Minute');
				console.log('--');
				self.do_variable_minute('10', function (err, data) {});
				times.hour = now.hour;
			}
			if (times.fifteen_minute_mark != now.fifteen_minute_mark) {
				console.log('--');
				console.log('SCHEDULER FIRE! - 15 Minute');
				console.log('--');
				self.do_variable_minute('15', function (err, data) {});
				times.hour = now.hour;
			}
			if (times.day != now.day) {
				console.log('--');
				console.log('SCHEDULER FIRE! - DAY');
				console.log('--');
				self.do_day(function (err, data) {});
				times.day = now.day;
			}
			times = now;
		}, 1000);
		return self;
	};

	/**
	 * Stop the Scheduler
	 * @return {object} self
	 */
	self.stop = function () {
		self.log('Stopping Scheduler');
		return self;
	};

	return self;

};

module.exports = Scheduler;
