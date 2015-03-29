import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  paper: null,

  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    events.get('tap').set( {threshold: 10, posThreshold: 20});
    return events;
  }.property("el"),

  enable: function(){
    var events = this.get("events");

    events.on("tap", Ember.$.proxy(this.start, this));
  },

  disable: function(){
    var events = this.get("events");
    events.off("tap");
  },

  start: function(e){
    // first place the textarea at the starting point.
    var el = this.get("el"),
        center = e.center,
        startx = center.x,
        starty = center.y,
        paper = this.get("paper"),
        point = this.convertPoint(startx, starty),
        circle = paper.circle(point.x, point.y, 10);

    circle.attr('stroke-width',  this.get("brushWidth"));
    circle.attr('stroke', this.get("brushColor"));
    circle.node.setAttribute('vector-effect', "non-scaling-stroke");
  }
});