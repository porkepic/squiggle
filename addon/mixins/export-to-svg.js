import Ember from "ember";

var container = '<g transform="scale(%s)">%h</g>';

export default Ember.Mixin.create({
  exportToSvg: function(){
    var svg = this.$("svg").clone(),
        div = document.createElement("div"),
        svgContent,
        promise;
    // clean up a little


    svg.find("image").remove();
    svg.find("defs").remove();
    svg.find("desc").remove();

    div.appendChild(svg[0]);

    svgContent = div.innerHTML;

    svgContent = svgContent.replace(svgContent.match(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/)[0], "");
    svgContent = svgContent.replace("</svg>", "");

    promise = new Ember.RSVP.Promise(function(resolve, reject){
      resolve(container.replace("%s", 1/(+svg.attr("width")) )
                       .replace("%h", svgContent) );
    });

    return promise;
  }
});