module.exports = function(grunt){
	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bowercopy: {
			options: {
				srcPrefix : 'bower_components',
				destPrefix: 'client/vendor/',
				runBower : true,
				clean : false
			},
			scripts : {
				files: {
					'angular-full': 'angular-full',
					'jquery-ui': 'jquery-ui',
					'moment': 'moment',
                    			'angular-moment': 'angular-moment'
				}
			}
		},
		shell: {
			multiple: {
				command: [
					'mkdir client/vendor/flat-ui',
					'cp -r bower_components/flat-ui/dist/* client/vendor/flat-ui/',
					'mkdir client/vendor/jquery',
					'cp -r bower_components/jquery/dist/* client/vendor/jquery/',
					'mkdir client/vendor/angular-ui-router',
					'cp  bower_components/angular-ui-router/release/* client/vendor/angular-ui-router/',
                    			'mkdir client/vendor/angular-http-auth',
					'cp bower_components/angular-http-auth/src/http-auth-interceptor.js client/vendor/angular-http-auth/http-auth-interceptor.js',
					'mkdir client/vendor/bootstrap-social',
					'cp bower_components/bootstrap-social/bootstrap-social.css client/vendor/bootstrap-social/bootstrap-social.css',
					'rm -r bower_components/*'
				].join('&&')
			}	
		}
		
	});	
	grunt.loadNpmTasks('grunt-bowercopy');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('bower',['bowercopy','shell']);
};
