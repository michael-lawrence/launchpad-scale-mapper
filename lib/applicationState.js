var _ = require('lodash'),
	util = require('util'),
	ScaleMode = require('./mode/scale'),
	EventEmitter = require('events').EventEmitter,
	Module = function (config, midiOutput) {
		EventEmitter.call(this);
		this.config = config;
		this.setMode(new ScaleMode(this, midiOutput));
		this.setScaleAndKeyIndex(0, 0);
	};

util.inherits(Module, EventEmitter);

Module.CHANGE_SCALE = 'CHANGE_SCALE';
Module.CHANGE_KEY = 'CHANGE_KEY';
Module.CHANGE = 'CHANGE';
Module.NEXT_SCALE = 'NEXT_SCALE';
Module.PREV_SCALE = 'PREV_SCALE';
Module.NEXT_KEY = 'NEXT_KEY';
Module.PREV_KEY = 'PREV_KEY';

Module.prototype.setMode = function (mode) {
	this.mode = mode;
}

Module.prototype.setScaleIndex = function (index) {
	this.scaleIndex = index;
	this.scale = _.keys(this.config.scales)[this.scaleIndex];
	this.emit(Module.CHANGE_SCALE);

	this.setKeyIndex(0);
};

Module.prototype.setKeyIndex = function (index) {
	this.keyIndex = index;
	this.key = _.keys(this.config.scales[this.scale])[this.keyIndex];
	this.emit(Module.CHANGE_KEY);

	this.current = this.config.scales[this.scale][this.key];
	this.emit(Module.CHANGE);
};

Module.prototype.setScaleAndKeyIndex = function (scaleIndex, keyIndex) {
	this.setScaleIndex(scaleIndex);
	this.setKeyIndex(keyIndex);
};

Module.prototype.nextScale = function () {
	this.setScaleIndex(Math.max(0, this.scaleIndex - 1));
	this.emit(Module.NEXT_SCALE);
};

Module.prototype.previousScale = function () {
	this.setScaleIndex(Math.min(_.size(this.config.scales) - 1, this.scaleIndex + 1));
	this.emit(Module.PREV_SCALE);
};

Module.prototype.nextKey = function () {
	this.setKeyIndex(Math.min(_.size(this.config.scales[this.scale]) - 1, this.keyIndex + 1));
	this.emit(Module.NEXT_KEY);
};

Module.prototype.previousKey = function () {
	this.setKeyIndex(Math.max(0, this.keyIndex - 1));
	this.emit(Module.PREV_KEY);
};

Module.prototype.getMidiValue = function (x, y) {
	var o = {};
	o.note = this.current[Math.min(x, this.current.length - 1)];
	o.value = _.indexOf(this.config.notes, o.note, this.config.startingNoteIndex + (y * 12));
	return o;
}

module.exports = Module;