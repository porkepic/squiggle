import Ember from "ember";
export default Ember.Mixin.create({
  exportToPng: function(){
    var img = this.get("image"),
        canvas = this.$("canvas")[0],
        context = canvas.getContext("2d"),
        outerSvg = this.$(".squiggle-paper").clone(),
        svg,
        svgImg = new Image(),
        url, promise,
        that = this;

    outerSvg.find("textarea").remove();
    outerSvg.find("image").remove();
    svg = outerSvg.find("svg");

    promise = new Ember.RSVP.Promise(function(resolve, reject){
      try {
        if(img){
          img = that.$("img")[0];
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          svg.attr("width", canvas.width);
          svg.attr("height", canvas.height);

          context.drawImage(img, 0, 0);

        }else{
          canvas.width = that.$().width();
          canvas.height = that.$().height();
        }

        url = "data:image/svg+xml," + outerSvg.html();

        svgImg.onload = function(){
          context.drawImage(svgImg, 0, 0);
          resolve(canvas.toDataURL());
        };
        svgImg.onError = reject;
        svgImg.src = url;

      } catch(e){
        reject(e);
      }
    });

    return promise;
  }
});