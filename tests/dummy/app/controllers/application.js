import Ember from "ember";

export default Ember.ObjectController.extend({
  canvas: null,

  image: null,

  delayImageLoad: function(){
    // test image reloading
    Em.run.later(this, function(){
      this.set("image", "grid.svg");
    }, 3000);
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