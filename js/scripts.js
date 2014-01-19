// Create a global variable to hold application with some state variables and stuff
var dd = {
    
    // Keep these around
    canvas:      null,
    ctx:         null,
    shapes:      [],

    // Need to know our current state
    activeShape: null,
    activeTool:  "move",

    // And for the event handlers to know what is happening
    dragState:   ""
};

$(window).ready(function($) {
    dd.canvas = document.getElementById('surface');
    dd.ctx = dd.canvas.getContext("2d");

    // Set canvas to fullscreen
    dd.canvas.width = window.innerWidth;
    dd.canvas.height = window.innerHeight;

    // And make sure it stays so
    $(window).on('resize', function() {
        dd.canvas.width = window.innerWidth;
        dd.canvas.height = window.innerHeight;

        // TODO: Call rendering action to redraw 
    });

    // Setup a closure which encapsulates all event handling
    (function() {
        var dragging = false,
            original  = {x: 0, y: 0},
            start     = {x: 0, y: 0},
            current   = {x: 0, y: 0},
            te;

        // Clicks directly to canvas
        $("canvas#surface").on('mousedown touchstart', function(e) {

            // Add a new Shape, this is useless at this point
            dd.activeShape = new Shape(dd.ctx, {
                left: 100,
                top: 100,
                width: 200,
                height: 100
            });
            dd.shapes.push(dd.activeShape);
        });

        // Toolbar tool buttons
        $('aside#toolbar button.tool').on('click', function(e) {
            $('aside#toolbar button.tool').removeClass('btn-success');
            $(this).addClass("btn-success");
            dd.activeTool = $(this).attr("id");
        });

        // Handle dragging of toolbar
        $('aside#toolbar hr.handle').on('mousedown touchstart', function(e) {
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

            dd.dragState = "toolbar";
            original.x = parseInt($('aside#toolbar').css('left'));
            original.y = parseInt($('aside#toolbar').css('bottom'));

        });

        // General drag handler for all movement
        $('section#editor').on('mousemove touchmove', function(e) {
            // No need for action if not actually dragging
            if (dd.dragState === "") {
                return;
            } 
            // To stop scrolling to take over and bubbling
            e.preventDefault();

            if (e.type === 'touchmove') {
                te = e.originalEvent;
                current.x = te.changedTouches[0].clientX;
                current.y = te.changedTouches[0].clientY;
            } else {
                current.x = e.clientX;
                current.y = e.clientY;
            }

            switch (dd.dragState) {
                case "toolbar":
                    moveToolbar(original, start, current);
                    break;
            }
        
        // And handle end of drag
        }).on('mouseup mouseleave touchend touchcancel', function(e) {
            switch (dd.dragState) {
                case "toolbar":
                    // Need to store current position for next move
                    original.x = original.x + current.x - start.x;
                    original.y = original.y + start.y - current.y;
                    break;
            }
            
            // And dragging has stopped
            dd.dragState = "";
        });

        // Put function declarations last for better readability
        // They will be hoisted up remember

        function moveToolbar(o, s, c) {
            $('aside#toolbar').css({
                'left': o.x + c.x - s.x,
                'bottom' : o.y + s.y - c.y
            });
        };

    } ());

});


$("canvas")
.mousedown(function(e) {
    dd.startX = e.offsetX;
    dd.startY = e.offsetY;
})
.mouseup(function(e) {
    dd.endX = e.offsetX;
    dd.endY = e.offsetY;
    drawLine();
})

function drawLine() {
    var c=document.getElementById("surface");
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(dd.startX, dd.startY);
    ctx.lineTo(dd.endX, dd.endY);
    ctx.closePath();

    ctx.strokeStyle = $('input#foreground').val();
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
