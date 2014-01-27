/*globals Base*/
/*jslint indent: 4 */
var Dimension = Base.extend({

    // Takes an options object as parameters
    constructor: function(o) {
        this.left = (typeof o.left !== "undefined" ? o.left : 0);
        this.top = (typeof o.top !== "undefined" ? o.top : 0);
        this.width = (typeof o.width !== "undefined" ? o.width : 100);
        this.height = (typeof o.height !== "undefined" ? o.height : 100);
    },
    left: 0,
    top: 0,
    width: 0,
    height: 0,

    // This function checks if the given coordinate is inside Dimension bounds
    // returns boolean
    covers: function(x, y) {
        return (x >= this.left && x <= (this.left + this.width )) &&
            (y >= this.top && y <= (this.top + this.height ));
    }
});

var Shape = Base.extend({

    // Takes an options object as parameters
    constructor: function(o) {
        // use timestamp as id
        this.id = new Date().getTime();

        this.dim = new Dimension(o);
        this.solid = (typeof o.solid !== "undefined" ? o.solid : false);
        this.foreground = (typeof o.foreground !== "undefined" ? o.foreground : "#000000");
        this.background = (typeof o.background !== "undefined" ? o.background : "#ff0000");
        this.lineWidth = (typeof o.lineWidth !== "undefined" ? o.lineWidth : "#ff0000");
    },

    id: null,

    dim: null,

    lineWidth: 1,
    background: "#000000",
    background: "#ff0000",
    solid: false,

    setEndPoint: function(o) {
        this.dim.width = o.x - this.dim.left;
        this.dim.height = o.y - this.dim.top;
    },
    
    draw: function() {
        console.log('Shape.draw should be overridden!');
    },

    drawBorder: function(ctx) {
        ctx.strokeStyle = "#dddddd";
        ctx.strokeRect(this.dim.left, this.dim.top, this.dim.width, this.dim.height);
        ctx.stroke();
    }
});

var Rect = Shape.extend({
    // Takes an options object as parameters
    constructor: function(o) {

        // Just pass to super constructor
        this.base(o);
    },

    draw: function(ctx) {

        ctx.beginPath();
        ctx.rect(this.dim.left, this.dim.top, this.dim.width, this.dim.height);
        if (this.solid) {
            ctx.fillStyle = this.background;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.stroke();
    }
});