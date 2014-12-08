import Ember from "ember";

export default Ember.Object.extend({
  exportToPng: function(){
    var canvas = this.get("squiggle")
    if(canvas){
      return canvas.exportToPng();
    }
  }
});