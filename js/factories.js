/*globals dd*/
/*jslint indent: 4 */

/***********************************************
    Extend dd object with factory functions 
    for creating shapes
***********************************************/


// Populate object with default values / values from UI if not set
dd.defaultsForShape = function(o) {
  return {
    x: o.x,
    y: o.y,
    width: (typeof o.width !== "undefined" ? o.width : 10),
    height: (typeof o.height !== "undefined" ? o.height : 10),
    solid: (typeof o.solid !== "undefined" ? o.solid : $('input#solid').attr('checked') == "checked"),
    foreground: (typeof o.foreground !== "undefined" ? o.foreground : $('input#foreground').val()),
    background: (typeof o.background !== "undefined" ? o.background : $('input#background').val()),
    lineWidth: (typeof o.lineWidth !== "undefined" ? o.lineWidth : $('input#lineWidth').val())
  };
}

dd.createRect = function(o) {
  return new Rect(this.defaultsForShape(o));
}