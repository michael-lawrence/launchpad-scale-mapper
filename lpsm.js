var _ = require('lodash'),
	Package = require('./package.json'),
	Config = require('./config.json'),
	ApplicationState = require('./lib/applicationState'),
	Launchpad = require('launchpadder').Launchpad,
	Color = require('launchpadder').Color,
	log = require('./lib/log'),
	midi = require('midi'),
	pad = new Launchpad(0, 0),
	midiOutput = new midi.output(),
	state = new ApplicationState(Config, midiOutput);

state.on(ApplicationState.CHANGE_KEY, function () {
	pad.allDark();

	for (var x = 0; x < 8; x++) {
		for (var y = 0; y < 8; y++) {
			var button = pad.getButton(x, y);

			if (x < state.current.length) {
				button.light(Color.LOW_GREEN);
			} else {
				button.light(Color.LOW_AMBER);
			}
		}
	}
});

pad.on('press', _.bind(state.mode.buttonPress, state.mode));
pad.on('release', _.bind(state.mode.buttonRelease, state.mode));

process.on('SIGINT', function () {
	log('Shutting down...');
	midiOutput.closePort();
	pad.allDark();
	process.exit();
});

log('Running...');

state.setScaleAndKeyIndex(0, 0);

midiOutput.openVirtualPort(Package.name);