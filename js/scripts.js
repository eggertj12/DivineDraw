$("canvas")
.mousedown(function(e) {
    var lineStart = new Line();
    lineStart.startX = e.pageX;
    lineStart.startY = e.pageY;
})
.mouseup(function(e) {
    var lineEnd = new Line();
    lineEnd.endX = e.pageX;
    lineEnd.endY = e.pageY;
    drawLine(lineStart, lineEnd);
})

function drawLine(lineStart, lineEnd) {
    var c=document.getElementById("surface");
    var ctx=c.getContext("2d");
    ctx.moveTo(lineStart.startX, lineStart.startY);
    ctx.lineTo(lineEnd.endX, lineEnd.endY);
    ctx.stroke();
}

function Line() {
    
}

function startLine(){

}


function drawRedRectangle() {
    var c=document.getElementById("surface");
    var ctx=c.getContext("2d");
    ctx.fillStyle="FF0000";
    ctx.fillRect(0,0,150,75);
}

function drawSomeLine() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
ctx.moveTo(0,0);
ctx.lineTo(100,100);
ctx.stroke();
}

function drawSomePseudoCircle() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(100,100,40,0,2*Math.PI);
ctx.stroke();
}

function writeHelloWorld() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
ctx.font="30px Arial";
ctx.fillText("Hello World", 10, 50);
}

function writeHelloWorldAgain() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
ctx.font="30px Arial";
ctx.strokeText("Hello World",10,50);
}

function linearGradientExample() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
//Create a gradient
var grd = ctx.createLinearGradient(0,0,200,0);
grd.addColorStop(0,"red");
grd.addColorStop(1,"white");
//Fill a rectangle with this gradient
ctx.fillStyle=grd;
ctx.fillRect(10,10,150,80);
}

function radialGradientExample() {
var c=document.getElementById("surface");
var ctx=c.getContext("2d");
//Create the gradient
var grd=ctx.createRadialGradient(75,50,5,90,60,100);
grd.addColorStop(0,"red");
grd.addColorStop(1,"white");
//Fill with gradient
ctx.fillStyle=grd;
ctx.fillRect(10,10,150,80);
}