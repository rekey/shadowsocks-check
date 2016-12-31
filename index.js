const check = require('./libs/check.js');

function checkList(list) {
	let port = 18199;
	const promise = list.map((config) => {
		config.local = port++;
		return check(config)
			.then((time) => {
				config.time = time;
			});
	});
	return Promise.all(promise)
		.then(() => {
			return list;
		});
}

module.exports = checkList;

// const list = [{
// 	host: 'test1.ss',
// 	port: 1234,
// 	pwd: 'password',
// 	aes: 'aes-256-cfb'
// }, {
// 	host: 'test1.ss',
// 	port: 1234,
// 	pwd: 'password',
// 	aes: 'aes-256-cfb'
// }];

// checkList(list)
// 	.then((list) => {
// 		console.log(list);
// 	});