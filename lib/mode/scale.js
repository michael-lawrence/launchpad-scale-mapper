var util = require('util'),
	Color = require('launchpadder').Color,
	Mode = require('./index'),
	log = require('../log'),
	Module = function (state, midiOutput) {
		this.state = state;
		this.midiOutput = midiOutput;
	};

util.inherits(Module, Mode);

Module.prototype.buttonPress = function (button) {
	var x = button.getX(),
		y = button.getY();

	if (y === 8) {
		switch (x) {
			case 0: // UP
				this.state.nextScale();
				break;
			case 1: // DOWN
				this.state.previousScale();
				break;
			case 2: // LEFT
				this.state.previousKey();
				break;
			case 3: // RIGHT
				this.state.nextKey();
				break;
		}

		button.light(Color.GREEN);

		log(['Changing to', this.state.scale, this.state.key].join(' '));
	} else if (x < 8 && y < 8) {
		var value = this.state.getMidiValue(x, y);

		this.noteOn(value);

		console.log(value);
		button.light((button.getState() === Color.LOW_AMBER) ? Color.AMBER : Color.GREEN);
	} else {
		button.light(Color.GREEN);
	}

	console.log(button + ' was pressed');
};

Module.prototype.buttonRelease = function (button) {
	var x = button.getX(),
		y = button.getY();

	if (x < 8 && y < 8) {
		this.noteOff(this.state.getMidiValue(x, y));
		button.light((button.getState() === Color.AMBER) ? Color.LOW_AMBER : Color.LOW_GREEN);
	} else {
		button.dark();
	}

	console.log(button + ' was released');
};

module.exports = Module;