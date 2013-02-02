// Gruntfile.js
// Haraldutil grunt
// © 2013 Harald Rudell <harald@therudells.com> MIT License
// npm install <module> --save-dev

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunts')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.registerTask('default', [])

	grunt.initConfig({
		watch: {
			scripts: {
				files: ['lib/*.js', 'lib/views/**/*.js'],
				tasks: ['test'],
				options: {
					interrupt: true,
					debounceDelay: 250,
				},
			},
		},
	})
}
