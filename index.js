'use strict';

module.exports = {
  name: 'squiggle',
  included: function(app){
    app.import('bower_components/raphael/raphael.js');
    app.import('bower_components/hammerjs/hammer.js');
    app.import('bower_components/jquery-mousewheel/jquery.mousewheel.js');
  }
};
