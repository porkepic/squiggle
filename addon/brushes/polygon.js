import Ember from "ember";
import Base from "./base";

export default Base.extend({
  paper: null,
  shapes: null,
  el: null,

  _savedPath: null,
  _shape: null,

  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    events.get('tap').set( {threshold: 10, posThreshold: 20});
    return events;
  }.property("el"),

  enable: function(){
    var events = this.get("events");

    this._shape = this._savedPath = null;

    events.on("tap", Ember.$.proxy(this.start, this));
  },

  disable: function(){
    events.off("tap");
  },

  start: function(e){
    var center = e.center,
        startx = center.x,
        starty = center.y,
        paper = this.get("paper"),
        shapes = this.get("shapes"),
        events = this.get("events"),
        point;

    if(e.tapCount > 1){
      this.end(e);
      return;
    }

    point = this.convertPoint(startx, starty);
    if(!this._shape){
      this._shape = paper.path("M"+ point.x + " " + point.y);
      this._savedPath = this._shape.attr('path');

      shapes.push(this._shape);
      this._shape.attr('stroke-width',  this.get("brushWidth"));
      this._shape.attr('stroke', this.get("brushColor"));
      // this._shape.node.setAttribute('vector-effect', "non-scaling-stroke");

    }else{
      var path = this._savedPath,
          added_path = [];
      added_path.push("L");
      added_path.push(point.x);
      added_path.push(point.y);
      path.push(added_path);
      this._shape.attr('path', path);
    }
  },

  end: function(e){
    if(this._savedPath){
      this._savedPath.push("Z");
      this._shape.attr('path', this._savedPath);
      this._shape = this._savedPath = null;
    }
  }
});