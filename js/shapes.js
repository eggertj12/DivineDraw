/*globals Base*/
/*jslint indent: 4 */
var Dimension = Base.extend({

    // Takes an options object as parameters
    constructor: function(o) {
        this.startx = o.startx;
        this.starty = o.starty;
        this.endx = o.endx;
        this.endy = o.endy;

        this.left = Math.min(this.startx, this.endx);
        this.top = Math.min(this.starty, this.endy);
        this.right = Math.max(this.startx, this.endx);
        this.bottom = Math.max(this.starty, this.endy);
    },

    // These variables hold the start and end points for the shape
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,

    // And this is (calculated) bounding box for object
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    move: function(to, from) {
        var deltax = to.x - from.x,
            deltay = to.y - from.y;

        this.startx += deltax;
        this.starty += deltay;
        this.endx += deltax;
        this.endy += deltay;

        // Update bounding box
        this.left += deltax;
        this.top += deltay;
        this.right += deltax;
        this.bottom += deltay;
    },

    getPos: function() {
        return {
            x: this.left, 
            y: this.top
        };
    },
    
    // This function checks if the given coordinate is inside Dimension bounds
    // returns boolean
    covers: function(x, y) {
        return (x >= this.left && x <= this.right) &&
            (y >= this.top && y <= this.bottom);
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
        this.dim.right = Math.max(this.dim.startx, this.dim.endx);
        this.dim.bottom = Math.max(this.dim.starty, this.dim.endy);
    },

    move: function(to, from) {
        this.dim.move(to, from);
    },
    
    draw: function() {
        console.log('Shape.draw should be overridden!');
    },

    borderColor: "#555555",
    borderCount: 0,

    drawBorder: function(ctx) {
        // Toggle drawing of active border every 5 redraws
        if (this.borderCount++ > 5) {
            this.borderColor = (this.borderColor === "#555555" ? "#999999" : "#555555");
            this.borderCount = 0;
        }

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.strokeRect(this.dim.left, this.dim.top, this.dim.right - this.dim.left, this.dim.bottom - this.dim.top);
        ctx.stroke();
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
        ctx.rect(this.dim.left, this.dim.top, this.dim.right - this.dim.left, this.dim.bottom - this.dim.top);
        if (this.solid) {
            ctx.fillStyle = this.background;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.stroke();
    }
});

var Pen = Shape.extend({
    // Takes an options object as parameters
    constructor: function(o) {

        // Just pass to super constructor
        this.base(o);
        this.type = "Pen";
        this.points = (typeof o.points !== "undefined" ? o.points : []);

        if (typeof o.left !== "undefined") {
            this.dim.left = o.left;
            this.dim.top = o.top;
            this.dim.right = o.right;
            this.dim.bottom = o.bottom;
        }
    },

    points: null,

    setEndPoint: function(o) {
        var point;

        this.dim.endx = o.x;
        this.dim.endy = o.y;

        // Update bounding box
        this.dim.left = Math.min(this.dim.left, o.x);
        this.dim.top = Math.min(this.dim.top, o.y);
        this.dim.right = Math.max(this.dim.right, o.x);
        this.dim.bottom = Math.max(this.dim.bottom, o.y);

        // Points are stored relative to starting point to ease moving of object
        point = {
            x: o.x - this.dim.startx,
            y: o.y - this.dim.starty
        };

        this.points.push(point);
    },

    draw: function(ctx) {

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.beginPath();

        ctx.moveTo(this.dim.startx, this.dim.starty);
        for (var i = 0; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x + this.dim.startx, this.points[i].y + this.dim.starty);
        };

        ctx.stroke();
    }
});

var Circle = Shape.extend({
    //
    constructor: function(o) {
        this.base(o);
        this.type = "Circle";
    },

    draw: function(ctx) {

        ctx.beginPath();
        // The arc function and this circle assumes that the inputs for startx + endx == starty + endy
        var radius = ((this.dim.right - this.dim.left) + (this.dim.bottom - this.dim.top)) / 4;
        ctx.arc((this.dim.left+radius), (this.dim.top+radius), radius, 0, 2*Math.PI);
        if (this.solid) {
            ctx.fillStyle = this.background;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.stroke();

    }
});

var Line = Shape.extend({
    //
    constructor: function(o) {
        this.base(o);
        this.type = "Line";
    },

    draw: function(ctx) {

        ctx.beginPath();
        ctx.moveTo(this.dim.startx, this.dim.starty);
        ctx.lineTo(this.dim.endx, this.dim.endy);

        // Is this necessary ??
        if (this.solid) {
            ctx.fillStyle = this.background;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.foreground;
        ctx.stroke();
    }
});


var Text = Shape.extend({

    text: "",
    font: "",
    fontS: 0,


    constructor: function(o) {
        this.base(o);
        this.type = "Text";
        var temp = o.fontSize;
        this.fontS = parseInt(temp);

        // Make the string for font
        var aest = "normal";
        var space = " ";
        var fontType = o.font;
        var result0 = aest.concat(space);
        var result1 = result0.concat(this.fontS.toString());
        var result12 = result1.concat("px");
        var result2 = result12.concat(space);
        var result3 = result2.concat(o.fontType);
        this.font = result3;

        $("input#textInput").css({'visibility': 'visible',
            'position': 'absolute',
            left: o.x,
            top: o.y - this.fontS,
            font: this.font,
        });

        /*
        TODO: Autoselect textInput box
        // focus/select does not seem to work properly
        $("input#textInput").focus();
        $("input#textInput").select();
        // try a stupid workaround
        var hold = document.getElementById('textInput');
        hold.select();
        */
    },

    draw: function(ctx) {
        ctx.font = this.font;
        ctx.fillText(this.text, this.dim.startx, this.dim.starty);
    },
    setText: function(n) {
        this.text = n;
    }
})

