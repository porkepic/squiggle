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
  },

  move: function(e){
    var path = this._savedPath,
        added_path = [],
        center = e.center,
        point = this.convertPoint( center.x, center.y);
    e = e.srcEvent;
    added_path.push("L");
    added_path.push(point.x);
    added_path.push(point.y);
    path.push(added_path);
    this._shape.attr('path', path);
  },

  end: function(e){
    this._shape = this._savedPath = null;
  }
}); 