// Create a global variable to hold application with some state variables and stuff
var dd = {
    
    // Keep these around
    canvas:      null,
    ctx:         null,
    shapes:      [],

    // Need to know our current state
    activeShapes: [],
    activeCommand:  "createPen",

    // And for the event handlers to know what is happening
    dragState:   "",

    // A render function for drawing all those Divine things
    render: function() {
        var i;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.shapes.length; i++) {
            this.shapes[i].draw(this.ctx);

            if (this.activeShapes.indexOf(i) !== -1) {
                // Render a selected border on active shape
                this.shapes[i].drawBorder(this.ctx);
            }
        };

    },

    clickedShape: function(point) {
        var found = null;

        // Loop backwards through shapes to find clicked
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].dim.covers(point.x, point.y)) {
                found = i;
                break;
            }
        }

        return found;
    },

    // And a reference to it for manipulating if needed
    renderer: null
};

$(window).ready(function($) {
    // Start by verifying that localStorage is available
    if (!Modernizr.localstorage) {
        alert('Vafrinn þinn styður ekki localStorage. Þú munt ekki geta vistað teikninguna.');
        $('button#loadDrawing, button#saveDrawing').attr('disabled', 'disabled');
    }

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
    //  No need to focus this - here, that is?
    // $("input#textInput").focus();

    // Setup a closure which encapsulates all event handling
    (function() {
        var original  = {x: 0, y: 0},
            start     = {x: 0, y: 0},
            current   = {x: 0, y: 0};

        /*****************************************************************
         ** Event handlers for UI inputs
         ******************************************************************/

       /* $("input#textInput").focus();
        $("input#textInput").css({'visibility': 'visible'});
        $("input#textInput").on('keydown', function () {
            console.log(jQuery(this).val());
        });
        */

        // Toolbar tool buttons
        $('aside#toolbar button.tool').on('click', function(e) {

            // Reflect state of command via classes on buttons
            $('aside#toolbar button.tool').removeClass('btn-success');
            $(this).addClass("btn-success");

            // Get command from button
            dd.activeCommand = $(this).attr("data-command");
        });

        // Toolbar command buttons
        $('aside#toolbar button.command').on('click', function(e) {
            dd[$(this).attr("data-command")]();
        });

        // Shape attribute inputs that return value via .val()
        $('aside#toolbar input.input').on('change', function(e) {

            // Which attribute is being changed
            var attribute = $(this).attr('data-attribute');

            if (dd.activeShapes.length === 0) {
                return;
            }

            // Apply to all selected shapes
            for (var i = 0; i < dd.activeShapes.length; i++) {
                dd.shapes[dd.activeShapes[i]][attribute] = $(this).val();
            };
        });

        // Shape attribute checkboxes
        $('aside#toolbar input.check').on('change', function(e) {
            var attribute = $(this).attr('data-attribute');

            if (dd.activeShapes.length === 0) {
                return;
            }

            // Apply to all selected shapes
            for (var i = 0; i < dd.activeShapes.length; i++) {
                dd.shapes[dd.activeShapes[i]][attribute] = this.checked;
            };
        });

        /*****************************************************************
         ** Event handlers for file UI
         ******************************************************************/

        // Clicks to the buttons
        $('button#fileLoad').on('click', function() {
            var fileName = $('input#fileName').val();
            dd.loadShapes(fileName);
        });

        $('button#fileSave').on('click', function() {
            var fileName = $('input#fileName').val();
            dd.saveShapes(fileName);
        });
        $('button#fileCancel').on('click', dd.cancelFileUI);

        // Need to stop clicks on file dialog from bubbling to background
        $('aside#filebox').on('click', function(e) {
            e.stopPropagation();
        });

        // Cancel file on background click
        $('section#fileUI').on('click', dd.cancelFileUI);

        /*****************************************************************
         ** Event handlers for manipulating objects
         ******************************************************************/

        // Handle dragging of toolbar
        $('aside#toolbar hr.handle').on('mousedown touchstart', function(e) {
            // To stop scrolling to take over and bubbling
            e.preventDefault();
            e.stopPropagation();

            start = getEventCoordinates(e);

            dd.dragState = "toolbar";
            original.x = parseInt($('aside#toolbar').css('left'));
            original.y = parseInt($('aside#toolbar').css('bottom'));

        });

        // Clicks directly to canvas
        $("canvas#surface").on('mousedown touchstart', function(e) {
            var clickedShape;

            start = getEventCoordinates(e);

            // Is a create command active
            if (dd.activeCommand.indexOf('create') === 0) {

                // Add a new Shape, calls a factory function on dd object
                // Push returns new length of array
                dd.activeShapes.length = 0;
                dd.activeShapes.push(dd.shapes.push(dd[dd.activeCommand](start)) - 1);
                dd.dragState = "createShape";
            }

            if (dd.activeCommand === 'moveShape') {

                // Check if clicking on a shape
                clickedShape = dd.clickedShape(start);

                if (clickedShape !== null) {
                    if (!e.shiftKey && dd.activeShapes.indexOf(clickedShape) === -1) {
                        dd.activeShapes.length = 0;
                    }
                    if (dd.activeShapes.indexOf(clickedShape) === -1) {
                        dd.activeShapes.push(clickedShape);
                    }
                    dd.dragState = "moveShape";

                    // TODO: Update UI with values from selected shape           
                } else {
                    dd.activeShapes.length = 0;

                    // TODO: allow selection of multiple items
                }
            }
        });

        // General drag handler for all movement
        $('section#editor').on('mousemove touchmove', function(e) {
            // No need for action if not actually dragging
            if (dd.dragState === "") {
                return;
            } 
            // To stop scrolling to take over and bubbling
            e.preventDefault();

            current = getEventCoordinates(e);

            switch (dd.dragState) {
                case "toolbar":
                    moveToolbar(original, start, current);
                    break;
                case "createShape":
                    dd.shapes[dd.activeShapes[0]].setEndPoint(current);
                    break;
                case "moveShape":
                    for (var i = 0; i < dd.activeShapes.length; i++) {
                        dd.shapes[dd.activeShapes[i]].move(current, start);
                    };
                    start = current;
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
            
            // Dragging has stopped
            dd.dragState = "";
        });
        // Handle typing in the textbox
        $("input#textInput").on('keydown', function (e) {
            var textBox = dd.shapes[dd.shapes.length - 1];
             textBox.setText(jQuery(this).val());


             // Clear and hide the textbox on pressing enter
             if(e.keyCode == 13) {
                document.getElementById("textInput").value="";
                $("input#textInput").css({'visibility': 'hidden' })}
            });

        /*****************************************************************
         ** Helpers
         ******************************************************************/

        // Set up a timer to draw everything, 20 fps is a reasonable time, right
        dd.renderer = setInterval(function() {
            dd.render();

        }, 50);

        // Put function declarations last for better readability
        // They will be hoisted up remember

        function moveToolbar(o, s, c) {
            $('aside#toolbar').css({
                'left': o.x + c.x - s.x,
                'bottom' : o.y + s.y - c.y
            });
        }

        function getEventCoordinates(e)  {
            var type = e.type,
                coords = {},
                te;
            if (type.indexOf('touch') !== -1) {
                te = e.originalEvent;
                coords.x = te.changedTouches[0].clientX;
                coords.y = te.changedTouches[0].clientY;
            } else {
                coords.x = e.clientX;
                coords.y = e.clientY;
            }
            return coords;
        }

    } ());

});
