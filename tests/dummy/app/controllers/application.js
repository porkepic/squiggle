import Ember from "ember";

export default Ember.Controller.extend({
  canvas: null,

  image: null,

  delayImageLoad: function(){
    // test image reloading
    Ember.run.later(this, function(){
      this.set("image", "grid.svg");
    }, 0);
  }.on("init"),

  actions: {
    exportToPng: function(){
      this.get("canvas").exportToPng().then(function(data){
        window.location.href = data;
      });
    },
    exportToSvg: function(){
      this.get("canvas").exportToSvg().then(function(data){
        console.log(data);
      });
    }

  }
});
