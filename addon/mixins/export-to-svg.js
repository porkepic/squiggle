import Ember from "ember";
export default Ember.Mixin.create({
  exportToSvg: function(){
    var svg = this.$("svg").clone(),
        promise;
    // clean up a little
    svg.find("image").remove();
    svg.find("defs").remove();
    svg.find("desc").remove();
    promise = new Ember.RSVP.Promise(function(resolve, reject){
      resolve(svg.html());
    });

    return promise;
  }
});