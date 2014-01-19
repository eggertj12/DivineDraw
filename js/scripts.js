// Create a global variable to hold application
var DivineDraw = {};

$(window).ready(function($) {

    // Closure for toolbar container event handling
    (function() {
        var dragging = false,
            left     = 30,
            top      = 30,
            start    = {x: 0, y: 0},
            current  = {x: 0, y: 0},
            te;

        // Set up event handlers
        $('aside#toolbar').on('mousedown touchstart', function(e) {
            // To stop scrolling to take over and bubbling
            e.preventDefault();
            e.stopPropagation();

            if (e.type === 'touchstart') {
                te = e.originalEvent;
                start.x = te.changedTouches[0].clientX;
                start.y = te.changedTouches[0].clientY;
            } else {
                start.x = e.clientX;
                start.y = e.clientY;
            }

            // Acknowledge dragging is started
            dragging = true;
        });
        
        $('aside#toolbar').on('mousemove touchmove', function(e) {
            // Only if actually dragging
            if (!dragging) {
                return;
            } 
            // To stop scrolling to take over and bubbling
            e.preventDefault();
            e.stopPropagation();

            if (e.type === 'touchmove') {
                te = e.originalEvent;
                current.x = te.changedTouches[0].clientX;
                current.y = te.changedTouches[0].clientY;
            } else {
                current.x = e.clientX;
                current.y = e.clientY;
            }

            // Move toolbar
            $('aside#toolbar').css({
                'left': left + current.x - start.x,
                'top' : top + current.y - start.y
            });
        });

        $('aside#toolbar').on('mouseup mouseleave touchend touchcancel', function(e) {
            // Need to store current position for next move
            left = left + current.x - start.x;
            top = top + current.y - start.y;
            // And dragging has stopped
            dragging = false;
        });        
    } ());

});


$("canvas")
.mousedown(function(e) {
    DivineDraw.startX = e.offsetX;
    DivineDraw.startY = e.offsetY;
})
.mouseup(function(e) {
    DivineDraw.endX = e.offsetX;
    DivineDraw.endY = e.offsetY;
    drawLine();
})

function drawLine() {
    var c=document.getElementById("surface");
    var ctx=c.getContext("2d");
    var yfactor = 2.9;
    var xfactor = 2.16;
    ctx.moveTo(DivineDraw.startX / xfactor, DivineDraw.startY / yfactor);
    ctx.lineTo(DivineDraw.endX / xfactor, DivineDraw.endY / yfactor);
    ctx.stroke();
}
/*
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
*/
