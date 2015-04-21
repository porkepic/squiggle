var S = " ",
    Str = String,
    has = "hasOwnProperty";
var $ = function (el, attr) {
    if (attr) {
        if (typeof el == "string") {
            el = $(el);
        }
        for (var key in attr) if (attr[has](key)) {
            if (key.substring(0, 6) == "xlink:") {
                el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
            } else {
                el.setAttribute(key, Str(attr[key]));
            }
        }
    } else {
        el = R._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
        el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
    }
    return el;
};
window.Raphael._engine.setViewBox = function (x, y, w, h, fit) {
    eve("raphael.setViewBox", this, this._viewBox, [x, y, w, h, fit]);
    var paperSize = {width:this.canvas.parentNode.offsetWidth},
        size = w / paperSize.width, //mmax(w / paperSize.width, h / paperSize.height),
        top = this.top,
        aspectRatio = fit ? "xMidYMid meet" : "xMinYMin",
        vb,
        sw;
    if (x == null) {
        if (this._vbSize) {
            size = 1;
        }
        delete this._vbSize;
        vb = "0 0 " + this.width + S + this.height;
    } else {
        this._vbSize = Math.min(1/size, 1);
        vb = x + S + y + S + w + S + h;
    }
    $(this.canvas, {
        viewBox: vb,
        preserveAspectRatio: aspectRatio
    });

    while (size && top) {
        sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
        top.attr({"stroke-width": sw});
        top._.dirty = 1;
        top._.dirtyT = 1;
        top = top.prev;
    }
    this._viewBox = [x, y, w, h, !!fit];
    return this;
};

export default window.Raphael;