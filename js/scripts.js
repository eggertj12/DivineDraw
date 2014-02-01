// Create a global variable to hold application with some state variables and stuff
var dd = {
    
    // Keep these around
    canvas:      null,
    ctx:         null,
    shapes:      [],
    undos:       [],
    redos:       [],

    // Need to know our current state
    activeShapes: [],
    activeCommand:  "createPen",

    // For alerting when clearing
    modified: false,

    // And for the event handlers to know what is happening
    dragState: "",
    moveUndo: false, 

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

    // Check if this point contains a shape
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
    });

    $("input#textInput").focus();

    // Setup a closure which encapsulates all event handling
    (function() {
        var original  = {x: 0, y: 0},
            start     = {x: 0, y: 0},
            current   = {x: 0, y: 0};

        /*****************************************************************
         ** Event handlers for UI inputs
         ******************************************************************/

        $("input#textInput").focus();
        $("input#textInput").css({'visibility': 'visible'});
        $("input#textInput").on('keydown', function () {
            console.log(jQuery(this).val());
        });

        // Toolbar tool buttons
        $('aside#toolbar button.tool').on('click', function(e) {

            // Reflect state of command via classes on buttons
            $('aside#toolbar button.tool').removeClass('btn-success');
            $(this).addClass("btn-success");

            // Get command from button
            dd.activeCommand = $(this).attr("data-command");

            // Deselect all shapes
            dd.activeShapes.length = 0;
        });

        // Toolbar command buttons
        $('aside#toolbar button.command').on('click', function(e) {
            dd[$(this).attr("data-command")]();
        });

        // Toolbar tool buttons
        $('aside#toolbar button#delete').on('click', function(e) {
            var shapes = [];

            // Nothing to do if no shape(s) selected
            if (dd.activeShapes.length === 0) {
                return;
            }

            // DeleteShapeAction takes care of the actual deletion. Just assemble the Shapes
            for (var i = dd.activeShapes.length - 1; i >= 0; i--) {
                shapes.push(dd.shapes[dd.activeShapes[i]]);
            };

            // Deselect all items
            dd.activeShapes.length = 0;
            
            // Always reset redos stack and mark drawing as modified when pushing a new undo
            dd.redos = [];
            dd.modified = true;
            dd.undos.push(new DeleteShapeAction(shapes, dd.shapes));

            $('button#redo').attr('disabled', 'disabled');
            $('button#undo').removeAttr('disabled');
        });

        $('aside#toolbar button#undo').on('click', function(e) {
            var action;
            
            if (dd.undos.length === 0) {
                console.log('undo stack is empty');
                return;
            }

            // Always deselect all items on undo / redo
            dd.activeShapes.length = 0;

            action = dd.undos.pop();
            action.undo(dd.shapes);
            dd.redos.push(action);

            // Update state of UI. Really need angular for this kind of stuff
            $('button#redo').removeAttr('disabled');
            if (!dd.undos.length) {
                $('button#undo').attr('disabled', 'disabled');
                dd.modified = false;
            }
        });

        $('aside#toolbar button#redo').on('click', function(e) {
            var action;
            
            if (dd.redos.length === 0) {
                console.log('redo stack is empty');
                return;
            }

            // Always deselect all items on undo / redo
            dd.activeShapes.length = 0;
            
            action = dd.redos.pop();
            action.redo(dd.shapes);
            dd.undos.push(action);
            dd.modified = true;

            // Update state of UI. Really need angular for this kind of stuff
            $('button#undo').removeAttr('disabled');
            if (!dd.redos.length) {
                $('button#redo').attr('disabled', 'disabled');
            }
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
            var newShape,
                clickedShape;

            start = getEventCoordinates(e);

            // Is a create command active
            if (dd.activeCommand.indexOf('create') === 0) {

                // Add a new Shape, calls a factory function on dd object
                newShape = dd[dd.activeCommand](start);

                // Adding a shape resets selection
                dd.activeShapes.length = 0;
                
                // Push returns new length of array
                dd.activeShapes.push(dd.shapes.push(newShape) - 1);

                // And add a new undo action for this, remeber to empty redos
                dd.redos = [];
                dd.undos.push(new AddShapeAction(newShape));
                dd.modified = true;

                $('button#redo').attr('disabled', 'disabled');
                $('button#undo').removeAttr('disabled');

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
                    dd.moveUndo = true;

                    // TODO: Update UI with values from selected shape           
                } else {
                    dd.activeShapes.length = 0;

                    // TODO: allow selection of multiple items
                }
            }
        });

        // General drag handler for all movement
        $('section#editor').on('mousemove touchmove', function(e) {
            var shapes = [];

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

                    if (dd.moveUndo) {
                        // MoveShapeAction needs an array of Shapes
                        for (var i = dd.activeShapes.length - 1; i >= 0; i--) {
                            shapes.push(dd.shapes[dd.activeShapes[i]]);
                        };

                        // Always reset redos stack when pushing a new undo
                        dd.redos = [];
                        dd.undos.push(new MoveShapeAction(shapes));
                        dd.modified = true;

                        $('button#redo').attr('disabled', 'disabled');
                        $('button#undo').removeAttr('disabled');

                        dd.moveUndo = false;
                    }

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
