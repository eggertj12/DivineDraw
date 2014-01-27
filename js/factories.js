/*globals dd*/
/*jslint indent: 4 */

dd.createRect = function(o) {
  return new Rect({
    left: o.x,
    top: o.y,
    width: 10,
    height: 10,
    solid: $('input#solid').attr('checked') == "checked"
  })
}