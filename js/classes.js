/*globals Base*/
/*jslint indent: 4 */
var Shape = Base.extend({

    // Takes a drawing context and an options object as parameters
    constructor: function(ctx, o) {
        // use timestamp as id
        this.id = new Date().getTime();

        this.ctx = ctx;
        this.left = o.left;
        this.top = o.top;
        this.width = o.width;
        this.height = o.height;
    },

    ctx: null,
    id: null,

    left: 0,
    top: 0,
    width: 0,
    height: 0,

    lineWidth: 1,
    foreground: "#000000",
    background: "#ff0000",
    
    draw: function() {
        console.log('Shape.draw should be overridden!');
    },

    drawBorder: function(message) {
        this.ctx.strokeStyle = "#dddddd";
        this.ctx.strokeRect(this.left, this.top, this.width, this.height);
        this.ctx.stroke();
    }
});
