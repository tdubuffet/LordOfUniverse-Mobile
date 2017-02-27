module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {

            dist: {
                src: ['src/<%= pkg.name %>.module.js', 'src/<%= pkg.name %>.*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }

        },

        ngAnnotate: {

            options: {
                singleQuotes: true,
            },

            dist: {

                files: {
                    'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
                }

            }

        },

        uglify: {

            options: { mangle: false },

            dist: {

                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }

            }

        },

        watch: {

            scripts: {
                files: ['src/*.js'],
                tasks: ['concat', 'ngAnnotate', 'uglify']
            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['concat', 'ngAnnotate', 'uglify']);

}
