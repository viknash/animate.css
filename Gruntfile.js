module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var concatAnim;

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['source/_base.css', 'source/**/*.css'], // _base.css required for .animated helper class
        dest: 'animate.css'
      }
    },

    autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
      options: {
        browsers: ['last 2 versions', 'bb 10']
      },
      no_dest: {
        src: 'animate.css' // output file
      }
    },

    cssmin: {
      options: {
        sourceMap: true
      },
      minify: {
        src: ['animate.css'],
        dest: 'animate.min.css',
      }
    },

    watch: {
      css: {
        files: ['source/**/*', 'animate-config.json'],
        tasks: ['default']
      }
    }

  });

  // fuction to perform custom task
  concatAnim = function () {

    var categories = grunt.file.readJSON('animate-config.json'),
      category, files, file,
      target = ['source/_base.css'],
      count = 0;

    var animationList = [];
    for (category in categories) {
      if (categories.hasOwnProperty(category)) {
        files = categories[category];
        var animations = [],
          animCount = 0;
        for (file in files) {
          if (files.hasOwnProperty(file) && files[file]) {
            target.push('source/' + category + '/' + file + '.css');
            animations[animCount] = file;
            animCount += 1;
            count += 1;
          }
        }
        animationList[category] = animations;
      }
    }
    console.log(animationList);

    if (!count) {
      grunt.log.writeln('No animations activated.');
    } else {
      grunt.log.writeln(count + (count > 1 ? ' animations' : ' animation') + ' activated.');
      require('fs').writeFileSync('animations.json', JSON.stringify(animationList, null, 4));
    }

    grunt.config('concat', {
      'animate.css': target
    });
    grunt.task.run('concat');

  };

  grunt.loadNpmTasks('grunt-travis-lint');
  // register task
  grunt.registerTask('concat-anim', 'Concatenates activated animations', concatAnim); // custom task
  grunt.registerTask('all', ['concat-anim', 'autoprefixer', 'cssmin']);
  grunt.registerTask('default', ['all']);
  grunt.registerTask('travis', ['travis-lint', 'all']);
  grunt.registerTask('dev', ['watch']);

};
