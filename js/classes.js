/*globals Base*/
/*jslint indent: 4 */
var Dimension = Base.extend({

    // Takes an options object as parameters
    constructor: function(o) {
        this.startx = (typeof o.x !== "undefined" ? o.x : 0);
        this.starty = (typeof o.y !== "undefined" ? o.y : 0);
        this.endx = (typeof o.width !== "undefined" ? o.width + o.x : 10 + o.x);
        this.endy = (typeof o.height !== "undefined" ? o.height + o.y : 10 + o.y);

        this.left = Math.min(this.startx, this.endx);
        this.top = Math.min(this.starty, this.endy);
        this.width = Math.abs(this.startx - this.endx);
        this.height = Math.abs(this.starty - this.endy);
    },

    // These variables hold the start and end points for the shape
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,

    // And this is (calculated) bounding box for object
    top: 0,
    left: 0,
    width: 0,
    height: 0,

    // This function checks if the given coordinate is inside Dimension bounds
    // returns boolean
    covers: function(x, y) {
        return (x >= this.left && x <= this.left + this.width) &&
            (y >= this.top && y <= this.top + this.height);
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
    type: "Shape",

    dim: null,

    lineWidth: 1,
    background: "#000000",
    background: "#ff0000",
    solid: false,

    setEndPoint: function(o) {
        this.dim.endx = o.x;
        this.dim.endy = o.y;

        // Update bounding box
        // Will need to be overridden by Pen Shape
        this.dim.left = Math.min(this.dim.startx, this.dim.endx);
        this.dim.top = Math.min(this.dim.starty, this.dim.endy);
        this.dim.width = Math.abs(this.dim.startx - this.dim.endx);
        this.dim.height = Math.abs(this.dim.starty - this.dim.endy);
    },

    move: function(to, from) {
        this.dim.startx += to.x - from.x;
        this.dim.starty += to.y - from.y;
        this.dim.endx += to.x - from.x;
        this.dim.endy += to.y - from.y;

        // Update bounding box
        this.dim.left += to.x - from.x;
        this.dim.top += to.y - from.y;
    },
    
    draw: function() {
        console.log('Shape.draw should be overridden!');
    },

    borderStatus: true,
    borderCount: 0,

    drawBorder: function(ctx) {
        // Toggle drawing of active border every 5 redraws
        if (this.borderCount++ > 5) {
            this.borderStatus = !this.borderStatus;
            this.borderCount = 0;
        }

        if (this.borderStatus) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.strokeRect(this.dim.left, this.dim.top, this.dim.width, this.dim.height);
            ctx.stroke();
        }
    }
});

var Rect = Shape.extend({
    // Takes an options object as parameters
    constructor: function(o) {

        // Just pass to super constructor
        this.base(o);
        this.type = "Rect";
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