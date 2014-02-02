/* DivineDraw Project
 * Programming assignment 1 for VEFF II Spring 2014 
 * 
 * Davíð Arnar Sverrisson
 * Eggert Jóhannesson
 */

var Action = Base.extend({

    // Takes a Shape object or an array of Shapes
    constructor: function(s) {
        if (Array.isArray(s)) {
            this.shapes = s;
        } else {
            this.shapes = [s];
        }
        this.indices = [];
    },

    // The shapes this applies to
    shapes: [],
    // And their indices in the shape stack
    indices: [],

    // Descendants should overwrite this function
    undo: function() {
        console.log('This is the base Action undo command');
    },

    // Descendants should overwrite this function
    redo: function() {
        console.log('This is the base Action redo command');
    }
});

/*******************************************************
  This action stores added shape(s) and handles removing
  and reinserting them
*******************************************************/
var AddShapeAction = Action.extend({
    constructor: function(s) {
        this.base(s);
    },

    // Removes shapes from the stack array
    undo: function(stack) {

        // Loop backwards through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {

            // Search for it in the stack supplied to us
            for (var j = stack.length - 1; j >= 0; j--) {

                // Remove when found
                if (stack[j] === this.shapes[i]) {
                    stack.splice(j, 1);
                    this.indices[i] = j;
                }
            };
        };
    },

    // Readd shape
    redo: function(stack) {

        // Loop forward through array of shapes this Action applies to
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.indices[i] < stack.length) {

                // Try to put in same place in array
                // Will result in wrong place if stack has had more changes
                stack.splice(this.length, 0, this.shapes[i])
            } else {

                // Impossible, just add to end
                stack.push(this.shapes[i]);
            }
        }
    }

});


/*******************************************************
  Exact opposite of AddShapeAction
  This action stores removed shape(s) and handles reinserting
  and re-removing them
*******************************************************/
var DeleteShapeAction = Action.extend({
    // This action takes care of doing the action not just storing it
    // Therefore needs to take the stack as parameter
    // TODO: Remove this inconsistency in calling actions
    constructor: function(s, stack) {
        this.base(s);
        this.redo(stack);
    },

    // Readd shape
    undo: function(stack) {

        // Loop forward through array of shapes this Action applies to
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.indices[i] < stack.length) {

                // Try to put in same place in array
                // Will result in wrong place if stack has had more changes
                stack.splice(this.length, 0, this.shapes[i])
            } else {

                // Impossible, just add to end
                stack.push(this.shapes[i]);
            }
        }
    },

    // Removes shapes from the stack array
    redo: function(stack) {

        // Loop backwards through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {

            // Search for it in the stack supplied to us
            for (var j = stack.length - 1; j >= 0; j--) {

                // Remove when found
                if (stack[j] === this.shapes[i]) {
                    stack.splice(j, 1);
                    this.indices[i] = j;
                }
            };
        };
    }

});

/*******************************************************
  This action stores old position of shape(s)
  and reapplies on undo
*******************************************************/
var MoveShapeAction = Action.extend({
    constructor: function(s) {
        this.base(s);

        this.oPos = [];
        this.nPos = [];

        for (var i = this.shapes.length - 1; i >= 0; i--) {
            this.oPos[i] = this.shapes[i].dim.getPos();
        };
    },

    // Old position
    oPos: [],
    // New position (on undo)
    nPos: [],

    // Readd shape
    undo: function() {

        // Loop through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {

            // Only needed once
            if (typeof this.nPos[i] === 'undefined') {
                // Store current position of shapes
                this.nPos[i] = this.shapes[i].dim.getPos();
            }

            // Move to old original position
            this.shapes[i].move(this.oPos[i], this.nPos[i]);
        };
    },

    // Removes shapes from the stack array
    redo: function(stack) {
        // Loop through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            // Move to the stored nPos
            this.shapes[i].move(this.nPos[i], this.oPos[i]);
        }
    }

});

/*******************************************************
  This action stores old attributes of shape(s)
  and reapplies on undo
*******************************************************/
var AttributeAction = Action.extend({
    constructor: function(s) {
        this.base(s);

        this.oAttr = [];
        this.nAttr = [];

        for (var i = this.shapes.length - 1; i >= 0; i--) {
            this.oAttr[i] = this.shapes[i].getAttributes();
        };
    },

    // Old attributes
    oAttr: [],
    // New attributes (on undo)
    nAttr: [],

    undo: function() {

        // Loop through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {

            // Only needed once
            if (typeof this.nAttr[i] === 'undefined') {
                // Store current attributes of shape
                this.nAttr[i] = this.shapes[i].getAttributes();
            }

            // Move to old original state
            this.shapes[i].setAttributes(this.oAttr[i]);
        };
    },

    redo: function(stack) {
        // Loop through array of shapes this Action applies to
        for (var i = this.shapes.length - 1; i >= 0; i--) {
            // Restore to the stored nAttr
            this.shapes[i].setAttributes(this.nAttr[i]);
        }
    }

});