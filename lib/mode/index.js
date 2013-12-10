var Module = function (state, midiOutput) {
	this.state = state;
	this.midiOutput = midiOutput;
};

Module.prototype.init = function () {
	console.log('mode init');
};

Module.prototype.buttonPress = function (button) {
	console.log('buttonPress', button);
};

Module.prototype.buttonRelease = function (button) {
	console.log('buttonRelease', button);
};

Module.prototype.noteOn = function (value) {
	this.midiOutput.sendMessage([144, value, 127]);
};

Module.prototype.noteOff = function (value) {
	this.midiOutput.sendMessage([128, value, 127]);
};

module.exports = Module;