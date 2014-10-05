
module.exports = function(grunt){
var autoprefixer = require('autoprefixer-core');

grunt.initConfig({
    postcss: {
        options: {
            processors: [
                autoprefixer({ browsers: ['last 2 version'] }).postcss
            ]
        },
        dist: { src: 'css/*.css' }
    },
});

grunt.loadNpmTasks('grunt-postcss');

};
