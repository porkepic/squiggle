import Ember from "ember";

var container = '<g transform="scale(%s)">%h</g>';

export default Ember.Mixin.create({
  exportToSvg: function(){
    var svg = this.$("svg").clone(),
        promise;
    // clean up a little
    svg.find("image").remove();
    svg.find("defs").remove();
    svg.find("desc").remove();

    promise = new Ember.RSVP.Promise(function(resolve, reject){
      resolve(container.replace("%s", 1/(+svg.attr("width")) )
                       .replace("%h", svg.html()) );
    });

    return promise;
  }
});