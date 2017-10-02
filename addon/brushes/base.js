import Ember from "ember";
import frame from "./animation_frame";

export default Ember.Object.extend( Ember.Evented, {
  name: "none",
  enable: function(){},
  disable: function(){},
  convertPoint: function(x, y){
    var svg = this.get("el").find("svg")[0];
    return this.createPoint(x,y).matrixTransform(svg.getScreenCTM().inverse());
  },

  convertPointInverse: function(x, y){
    var svg = this.get("el").find("svg")[0];
    return this.createPoint(x,y).matrixTransform(svg.getScreenCTM());
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
  },

  currentImgRatio: function(){
    return this.currentViewBox()[2] / this.get("el").parent().find("img")[0].naturalWidth;
  },

  currentImgRatioConverted: function(){
    var el = this.get("el");
    return el.find("svg").width() / el.parent().find("img")[0].naturalWidth;
  }
});
