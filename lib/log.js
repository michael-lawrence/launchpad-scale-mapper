var Notifier = require('node-notifier'),
	Package = require('../package.json'),
	title = [Package.name, Package.version].join(' ');

module.exports = function (message) {
	Notifier.notify({
		'title': title,
		'message': message
	});

	console.log(message);
};