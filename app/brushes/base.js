import Ember from "ember";

export default Ember.Object.extend({
  enable: Ember.K,
  disable: Ember.K,
  convertPoint: function(x, y){
    var svg = this.get("el").find("svg")[0],
        pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
      
  }
});