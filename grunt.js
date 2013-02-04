module.exports = function (grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %>\r\n' +
                'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.licenses[0].url %> */',
            fileOverview: '/**\r\n' +
                ' * @fileOverview <%= pkg.name %>\r\n' +
                ' * @author       <%= pkg.author.name %>\r\n' +
                ' * @version      <%= pkg.version %>\r\n' +
                ' */',
            empty: '<% %>',
            bower: '{\r\n' +
                '    "name": "<%= pkg.name %>",\r\n' +
                '    "version": "<%= pkg.version %>",\r\n' +
                '    "main": "./build/taboverride.js"\r\n' +
                '}'
        },
        lint: {
            all: 'src/taboverride.js'
        },
        concat: {
            dist: {
                src: ['<banner>', '<banner:meta.fileOverview>', 'src/taboverride.js'],
                dest: 'build/taboverride.js'
            },
            newline: {
                src: ['build/taboverride.min.js', '<banner:meta.empty>'],
                dest: 'build/taboverride.min.js',
                separator: ''
            },
            bower: {
                src: '<banner:meta.bower>',
                dest: 'bower.json',
                separator: ''
            }
        },
        min: {
            all: {
                src: ['<banner>', 'build/taboverride.js'],
                dest: 'build/taboverride.min.js'
            }
        }
        // need to a create custom task for jsdoc-toolkit documentation
    });
    grunt.registerTask('default', 'lint concat:dist min concat:newline concat:bower');
};
