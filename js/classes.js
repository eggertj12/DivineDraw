/*globals Base*/
/*jslint indent: 4 */
var Dimension = Base.extend({

    // Takes an options object as parameters
    constructor: function(o) {
        this.x = (typeof o.x !== "undefined" ? o.x : 0);
        this.y = (typeof o.y !== "undefined" ? o.y : 0);
        this.width = (typeof o.width !== "undefined" ? o.width : 100);
        this.height = (typeof o.height !== "undefined" ? o.height : 100);
    },
    x: 0,
    y: 0,
    width: 0,
    height: 0,

    // This function checks if the given coordinate is inside Dimension bounds
    // returns boolean
    covers: function(x, y) {
        return (x >= this.x && x <= (this.x + this.width )) &&
            (y >= this.y && y <= (this.y + this.height ));
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
        this.dim.width = o.x - this.dim.x;
        this.dim.height = o.y - this.dim.y;
    },

    move: function(to, from) {
        this.dim.x += to.x - from.x;
        this.dim.y += to.y - from.y;
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
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(this.dim.x, this.dim.y, this.dim.width, this.dim.height);
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
        ctx.rect(this.dim.x, this.dim.y, this.dim.width, this.dim.height);
        if (this.solid) {
            ctx.fillStyle = this.background;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.stroke();
    }
});