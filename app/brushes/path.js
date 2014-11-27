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

  start: function(e, callback){
    var center = e.center,
        startx = center.x,
        starty = center.y,
        paper = this.get("paper"),
        offset = this.get("el").offset(),
        shapes = this.get("shapes"),
        events = this.get("events");

    startx = startx - offset.left;
    starty = starty - offset.top;

    this._shape = paper.path("M"+startx+ " " +starty);
    this._savedPath = this._shape.attr('path');

    shapes.push(this._shape);
    this._shape.attr('stroke-width',  this.get("brushWidth"));
    this._shape.attr('stroke', this.get("brushColor"));
  },

  move: function(e){
    var path = this._savedPath,
        added_path = [],
        offset = this.get("el").offset(),
        center = e.center;
    e = e.srcEvent;
    added_path.push("L");
    added_path.push(center.x - offset.left);
    added_path.push(center.y - offset.top);
    path.push(added_path);
    this._shape.attr('path', path);
  },

  end: function(e){
    this._shape = this._savedPath = null;
  }
}); 