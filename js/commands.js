/*globals dd*/
/*jslint indent: 4 */

/***********************************************
    Extend dd object with functions for 
    handling commands
***********************************************/

dd.newDrawing = function() {
    
    // For now just trash everything
    // Should really give some warning
    this.shapes = [];
    this.activeShape = null;
}

dd.saveDrawing = function() {
    
    // For now just a single possible save
    localStorage.setItem("dd", JSON.stringify(this.shapes));
}

dd.loadDrawing = function() {

    var loaded   = [],
        created  = [],
        factory,
        i;

    // For now just a single possible save
    loaded = JSON.parse(localStorage.getItem("dd"));

    for (var i = 0; i < loaded.length; i++) {

        // Need to merge loaded object with it's child dim since factory expects a flat object
        // Conveniently jQuery has a method for this
        jQuery.extend(loaded[i], loaded[i].dim);

        // Get a new shape from the factory for this type
        factory = 'create' + loaded[i].type;
        this.shapes.push(dd[factory](loaded[i]));
    };
}
