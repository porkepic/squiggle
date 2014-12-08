import Ember from "ember";
import exporter from "../utils/exporter";

export default Ember.ObjectController.extend({
  exporter: function(){
    return exporter.create();
  }.property(),
  
  actions: {
    exportToPng: function(){
      this.get("exporter").exportToPng().then(function(data){
        window.location.href = data;
      });
    }
  }
});