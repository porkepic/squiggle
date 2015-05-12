import Ember from "ember";

export default Ember.ObjectController.extend({
  canvas: null,

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