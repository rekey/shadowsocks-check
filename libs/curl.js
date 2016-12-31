
const Promise = require('bluebird');

const spawn = require('child_process').spawn;

function curl(local) {
	return new Promise((resolve, reject) => {
		const child = spawn('curl', ['--socks5-hostname', '127.0.0.1:' + local, '-I', '-m', '5', 'http://twitter.com']);
		const resp = [];
		const err = [];
		child.stdout.on('data', (data) => {
			resp.push(data);
		});

		child.stderr.on('data', (data) => {
			err.push(data);
		});

		child.on('close', (code) => {
			if (resp.length) {
				return resolve(resp.join(''));
			}
			reject(err.join(''));
		});
	});
}

module.exports = curl;
