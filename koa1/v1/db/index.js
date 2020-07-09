const { Readable } = require('stream');

const users = require('./users.json');

module.exports = {
	users: {
		find: dbFindUsers
	}
};

/**
 * Find users in database
 *
 * @param      {Object}  [filter]             The filter
 * @param      {Object}  [opts]               The options
 * @param      {Object}  [opts.stream=false]  The flag to return readable stream
 * @return     {(Promise|Readable)}
 */
function dbFindUsers(filter, opts) {
	opts = opts || {};

	if (opts.stream) {
		const dbStream = new Readable({ objectMode: true });
		const buf = users.map(v => ({ ...v }));

		dbStream._read = function() {
			const data = buf.shift() || null;
			this.push(data);
		};

		return dbStream;
	}

	return new Promise((resolve) => {
		const networkDelay = Math.floor(Math.random() * 300);
		const result = users.map(v => ({ ...v }));

		setTimeout(() => resolve(result), networkDelay);
	});
}