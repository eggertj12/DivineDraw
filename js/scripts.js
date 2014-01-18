
// Create a global variable to hold application
var DivineDraw = {};

$(window).ready(function($) {

    console.log('ready');
    
    // Closure for toolbar event handling
    (function() {
        var dragging = false,
            left     = 30,
            top      = 30,
            start    = {x: 0, y: 0},
            current  = {x: 0, y: 0},
            te;

        // Set up event handlers
        $('aside#toolbar').on('mousedown touchstart', function(e) {
            console.log('mousedown');
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