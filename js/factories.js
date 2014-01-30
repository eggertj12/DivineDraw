/*globals dd*/
/*jslint indent: 4 */

/***********************************************
    Extend dd object with factory functions 
    for creating shapes
***********************************************/


// Populate object with default values / values from UI if not set
// This populates all possible parameters, each constructor will then only use what it needs
dd.defaultsForShape = function(o) {
  var solid = document.getElementById('solid');
  return {
    x: o.x,
    y: o.y,
    width: (typeof o.width !== "undefined" ? o.width : 10),
    height: (typeof o.height !== "undefined" ? o.height : 10),
    solid: (typeof o.solid !== "undefined" ? o.solid : solid.checked),
    foreground: (typeof o.foreground !== "undefined" ? o.foreground : $('input#foreground').val()),
    background: (typeof o.background !== "undefined" ? o.background : $('input#background').val()),
    lineWidth: (typeof o.lineWidth !== "undefined" ? o.lineWidth : $('input#lineWidth').val()),
    font: (typeof o.font !== "undefined" ? o.font: "arial"),
    fontSize: (typeof o.fontSize !== "undefined" ? o.fontSize: 8),

  };
}

dd.createRect = function(o) {
  return new Rect(this.defaultsForShape(o));
}

dd.createCircle = function(o) {
  return new Circle(this.defaultsForShape(o));
}

dd.createLine = function(o) {
  return new Line(this.defaultsForShape(o));
}

dd.createText = function(o) {
  return new Text(this.defaultsForShape(o));
}