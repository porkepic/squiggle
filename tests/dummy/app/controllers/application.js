import Ember from "ember";
import exporter from "squiggle/utils/exporter";

export default Ember.ObjectController.extend({
  exporter: function(){
    return exporter.create();
  }.property(),

  actions: {
    exportToPng: function(){
      this.get("exporter").exportToPng().then(function(data){
        window.location.href = data;
      });
    },
    exportToSvg: function(){
      this.get("exporter").exportToSvg().then(function(data){
        console.log(data);
      });
    }

  }
});