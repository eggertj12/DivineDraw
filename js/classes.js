/*globals Base*/
/*jslint indent: 4 */
var Shape = Base.extend({
    "use strict";
    constructor: function(id, left, top, width, height) {
        this.id = id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    },
  
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    
    
    draw: function() {
        console.log('Shape.draw should be overridden!');
    },

    drawBorder: function(message) {
        console.log('TODO: Shape.Drawborder');
    }
});