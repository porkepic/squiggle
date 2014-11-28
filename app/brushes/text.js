import Ember from "ember";
import Base from "./base";

export default Base.extend({
  el: null,
  
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

  convertToSVG: function(){
    var value = this._area.val(),
        paper = this.get("el").find("svg")[0],
        text = document.createElementNS("http://www.w3.org/1999/xhtml", "div"),
        fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
        style = ["color:", this.get("brushColor"),
                 ";font-family: sans-serif;overflow-wrap: break-word;",
                 ";font-size:", this.get("fontSize"), "px",
                 ";width:", this._area.css("width")].join("");
    if(value && value.length > 0){
      // configure the elements to fit in the bounded box
      fo.setAttribute("x", this._area.css("left").replace("px", ""));
      fo.setAttribute("y", this._area.css("top").replace("px", ""));
      fo.setAttribute("width", 8 + (+this._area.css("width").replace("px", "")));
      fo.setAttribute("height", 8 + (+this._area.css("height").replace("px", "")));

      text.innerHTML =  value.replace(/\n/g, "<br/>");
      text.style.color = this.get("brushColor");
      text.style.fontFamily = "sans-serif";
      text.style.fontSize = this.get("fontSize") + "px";
      text.style.overflowWrap = "break-word";
      text.style.width = this._area.css("width");
      text.style.border = "4px dashed transparent";

      // insert everything into the dom
      fo.appendChild(text);
      paper.appendChild(fo);
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