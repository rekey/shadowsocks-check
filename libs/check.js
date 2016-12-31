const ss = require('./shadowsocks.js');
const curl = require('./curl.js');

function check(config) {
	const now = Date.now();
	let ssClient = {};
	return ss(config)
		.then((sslocal) => {
			ssClient = sslocal;
			return curl(sslocal.local);
		})
		.then((resp) => {
			return Date.now() - now;
		})
		.catch((resp) => {
			return 10000000;
		})
		.finally(() => {
			try {
				ssClient.kill();
			} catch (e) {

			}
		});
}

module.exports = check;
