import Ember from "ember";
import frame from "./animation_frame";

export default Ember.Object.extend( {
  enable: Ember.K,
  disable: Ember.K,
  convertPoint: function(x, y){
    var svg = this.get("el").find("svg")[0];
    return this.createPoint(x,y).matrixTransform(svg.getScreenCTM().inverse());
  },

  createPoint: function(x, y){
    var svg = this.get("el").find("svg")[0],
        pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt;
  },

  currentViewBox: function(){
    var svg = this.get("el").find("svg");
    return svg[0].getAttribute("viewBox").split(" ").map(function(v){
      return +v;
    });
  }
});