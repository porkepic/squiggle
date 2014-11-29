import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  paper: null,
  
  events: function(){
    var events = new Hammer(this.get("el").find("svg")[0]);
    return events;
  }.property("el"),

  enable: function(){
    var events = this.get("events");

    events.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    events.on("panstart", Ember.$.proxy(this.start, this));
    events.on("panmove", Ember.$.proxy(this.move, this));
    events.on("panend", Ember.$.proxy(this.end, this));
    events.on("tap", Ember.$.proxy(this.startTap, this));
  },

  disable: function(){
    var events = this.get("events");
    events.off("panstart");
    events.off("panmove");
    events.off("panend");
    events.off("tap");
  },

  startTap: function(e){
    this.start(e);
    this._area.css( this.checkEdges({
      top: +this._area.css("top").replace("px", ""),
      left: +this._area.css("left").replace("px", ""),
      width: 200,
      height: 50
    }));
    this.end();
  },

  start: function(e){
    // first place the textarea at the starting point.
    var el = this.get("el"),
        center = e.center,
        startx = center.x,
        starty = center.y,
        offset = this.get("el").offset();

    this._area = el.find("textarea");
    this._area.css({
      top: center.y - offset.top + $(window).scrollTop(),
      left: center.x - offset.left + $(window).scrollLeft()
    });
    this._area.addClass("active");
    this._initialCenter = center;
  },

  move: function(e){
    // when moving resize the area
    var center = e.center,
        offset = this.get("el").offset(),
        box;

    // check edge case when not growing the area
    if(center.x < this._initialCenter.x || center.y < this._initialCenter.y){
      var c = this._initialCenter;
      this._initialCenter = center;
      center = c;
    }

    // set the top/left, width/height

    box = {
      top: this._initialCenter.y - offset.top + $(window).scrollTop(),
      left: this._initialCenter.x - offset.left + $(window).scrollLeft(),
      width: center.x - this._initialCenter.x,
      height: center.y - this._initialCenter.y
    };

    this._area.css( this.checkEdges(box) );
  },

  end: function(e){
    this._area.focus();
    this._area.one("blur", Ember.$.proxy(this.convertToSVG, this));
  },

  checkEdges: function(box){
    var el = this.get("el"),
        width = el.width(),
        height = el.height();

    // account for 10 px for the padding and border;
    if(box.left + box.width > width){
      box.width = width - box.left - 10;
    }
    if(box.top + box.height > height){
      box.height = height - box.top - 10;
    }
    return box;
  },

  resizeTextNode: function(text, width) {
    var characters = text.textContent.split("").reverse(),
        character,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.getAttribute("y"),
        x = text.getAttribute("x"),
        dy = 0,
        tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

        // prepare the first tspan
        tspan.setAttribute("x", x);
        tspan.setAttribute("y", y);
        tspan.setAttribute("dy", dy + "em");
        
        // remove current text
        text.textContent = null;
        text.appendChild(tspan);

    
        
    while (character = characters.pop()) {
      line.push(character);
      tspan.textContent = line.join("");
      if (tspan.getComputedTextLength() > width) {
        line.pop();
        tspan.textContent = line.join("");
        line = [character];

        tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute("x", x);
        tspan.setAttribute("y", y);
        tspan.setAttribute("dy", (++lineNumber * lineHeight + dy) + "em");
        tspan.textContent = character;
        text.appendChild(tspan);
      }
    }
  },

  convertToSVG: function(){
    var value = this._area.val(),
        svg = this.get("el").find("svg")[0],
        text;
    if(value && value.length > 0){
      // configure the elements to fit in the bounded box
      var point = this._area.offset(),
          w = Ember.$(window);
      point = this.convertPoint(point.left - w.scrollLeft(), point.top - w.scrollTop() + 20);

      text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      text.setAttribute("y", point.y);
      text.setAttribute("x", point.x);
      text.textContent = value;
      text.setAttribute("fill", this.get("brushColor"));
      text.setAttribute("stroke", this.get("brushColor"));
      text.setAttribute("stroke-width", "0px");
      text.setAttribute("font-family", "sans-serif");
      text.setAttribute("font-size", this.get("fontSize") + "px");
      svg.appendChild(text);

      // find out width
      point = this.convertPoint(this.get("el").offset().left + this._area.width(), 0);
      this.resizeTextNode(text, point.x);
    }

    // remove the value for next use.
    this._area.val("");
    this._area.removeClass("active");
    this._area.css({
      width: 0,
      height: 0
    });
  }
}); 