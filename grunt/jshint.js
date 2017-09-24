module.exports = function () {
	return {
		files: [
			'Gruntfile.js',
			'grunt/{,**/}*.js',
			'test/{,**/}*.js',
			'src/{,**/}*.js',
      'preview/{,**/}*.js'
		],
		options: {
			jshintrc: 'grunt/conf/jshintrc.json'
		}
	};
};
