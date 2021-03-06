/* DivineDraw Project
 * Programming assignment 1 for VEFF II Spring 2014 
 * 
 * Davíð Arnar Sverrisson
 * Eggert Jóhannesson
 */

/***********************************************
    Extend dd object with factory functions 
    for creating shapes
***********************************************/


// Populate object with default values / values from UI if not set
// This populates all possible parameters, each constructor will then only use what it needs
dd.defaultsForShape = function(o) {
  var solid = document.getElementById('solid');

  o.startx = (typeof o.x !== "undefined" ? o.x : o.startx);
  o.starty = (typeof o.y !== "undefined" ? o.y : o.starty);
  o.endx = (typeof o.endx !== "undefined" ? o.endx : o.x + 1);
  o.endy = (typeof o.endy !== "undefined" ? o.endy : o.y + 1);
  o.solid = (typeof o.solid !== "undefined" ? o.solid : solid.checked);
  o.foreground = (typeof o.foreground !== "undefined" ? o.foreground : $('input#foreground').val());
  o.background = (typeof o.background !== "undefined" ? o.background : $('input#background').val());
  o.lineWidth = (typeof o.lineWidth !== "undefined" ? o.lineWidth : $('input#lineWidth').val());
  o.fontSize = (typeof o.fontSize !== "undefined" ? o.fontSize: $('input#fontSize').val());

  // Failed to use the above method for <select>
  var ft = document.getElementById('fontType');
  o.fontType = (typeof o.fontType !== "undefined" ? o.fontType: ft.options[ft.selectedIndex].value);

  return o;
}

dd.createRect = function(o) {
  return new Rect(this.defaultsForShape(o));
}

dd.createCircle = function(o) {
  return new Circle(this.defaultsForShape(o));
}

dd.createEllipse = function(o) {
  return new Ellipse(this.defaultsForShape(o));
}

dd.createLine = function(o) {
  return new Line(this.defaultsForShape(o));
}

dd.createText = function(o) {
  
  return new Text(this.defaultsForShape(o));
}

dd.createPen = function(o) {
  return new Pen(this.defaultsForShape(o));
}