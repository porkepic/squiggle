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
    return events;
  }.property("el"),

  enable: function(){
    var events = this.get("events");

    this._shape = this._savedPath = null;

    events.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    events.on("panstart", Ember.$.proxy(this.start, this));
    events.on("panmove", Ember.$.proxy(this.move, this));
    events.on("panend", Ember.$.proxy(this.end, this));
  },

  disable: function(){
    var events = this.get("events");
    events.off("panstart");
    events.off("panmove");
    events.off("panend");
  },

  _animationFrame: function(){
    var path = this._savedPath,
        added_path = [],
        pathPoint = this._pathPoint;
    this._pathPoint = null;
    if(!path){
      return;
    }
    if(pathPoint){
      pathPoint = this.convertPoint( pathPoint.x, pathPoint.y);
      added_path.push("L");
      added_path.push(pathPoint.x);
      added_path.push(pathPoint.y);
      path.push(added_path);
      this._shape.attr('path', path);
    }
    if(this._animate){
      window.requestAnimationFrame(Ember.$.proxy(this._animationFrame, this));
    }
  },

  start: function(e){
    var center = e.center,
        startx = center.x,
        starty = center.y,
        paper = this.get("paper"),
        shapes = this.get("shapes"),
        events = this.get("events"),
        point;

    point = this.convertPoint(startx, starty);

    this._shape = paper.path("M"+ point.x + " " + point.y);
    this._savedPath = this._shape.attr('path');

    shapes.push(this._shape);
    this._shape.attr('stroke-width',  this.get("brushWidth"));
    this._shape.attr('stroke', this.get("brushColor"));
    this._shape.node.setAttribute('vector-effect', "non-scaling-stroke");

    this._animate = true;
    window.requestAnimationFrame(Ember.$.proxy(this._animationFrame, this));
  },

  move: function(e){
    this._pathPoint = e.center;
  },

  end: function(e){
    this._animate = false;
    this._shape = this._savedPath = null;
  }
});