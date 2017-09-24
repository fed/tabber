module.exports = function () {
	return {
		server: {
			options: {
				hostname: '*',
				port: process.env.PORT || '4567',
				base: ['.', 'preview']
			}
		}
	};
};
