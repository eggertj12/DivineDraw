/*globals dd*/
/*jslint indent: 4 */

/***********************************************
    Extend dd object with functions for 
    handling commands
***********************************************/

dd.newDrawing = function() {
    
    // No undo for this action
    if (dd.modified) {
        if (confirm('Viltu henda teikningu? Ekki hægt að hætta við eftir á!')) {
            this.shapes = [];
            this.activeShapes = [];
        }
    } else {
        this.shapes = [];
        this.activeShapes = [];
    }
};

dd.cancelFileUI = function() {
    jQuery('section#fileUI').css('display', 'none');
};

dd.filenameClicked = function() {
    jQuery('input#fileName').val(jQuery(this).text());
};

dd.buildFilelistUI = function() {
    // Build file list UI
    jQuery('ul#files').empty();
    for (var i = dd.files.length - 1; i >= 0; i--) {
        jQuery('ul#files').append('<li>' + dd.files[i] + '</li>');
    };
    jQuery('ul#files li').on('click', this.filenameClicked);
};

dd.fileDelete = function(filename) {
    if (filename === '') {
        return;
    }

    if (!confirm('Viltu eyða valinni skrá?')) {
        return;
    }

    dd.deleteFile(filename);
    dd.files.splice(dd.files.indexOf(filename), 1);
    dd.setFileList(dd.files);

    dd.buildFilelistUI();
    jQuery('input#fileName').val('');
};

dd.files = [];

dd.saveDrawing = function() {
    this.files = this.getFileList();

    dd.buildFilelistUI();

    // Adjust UI to saving
    jQuery('button#fileLoad').css('display', 'none');
    jQuery('button#fileSave').css('display', 'inline-block');
    jQuery('input#fileName').removeAttr('disabled');
    jQuery('aside#filebox h1').text('Vista teikningu');

    // Show file UI
    jQuery('section#fileUI').css('display', 'block');
};

dd.loadDrawing = function() {
    if (dd.modified) {
        if (!confirm('Viltu henda núverandi teikningu?')) {
            return;
        }
    }

    this.files = this.getFileList();

    dd.buildFilelistUI();

    // Adjust UI to saving
    jQuery('button#fileLoad').css('display', 'inline-block');
    jQuery('button#fileSave').css('display', 'none');
    jQuery('input#fileName').attr('disabled', 'disabled');
    jQuery('aside#filebox h1').text('Hlaða teikningu');

    // Show file UI
    jQuery('section#fileUI').css('display', 'block');
};


dd.saveShapes = function(filename) {

    if (!filename) {
        alert('Veldu eða skráðu nafn til að vista undir!')
        return;
    }

    if (dd.files.indexOf(filename) !== -1) {

        // Filname exists
        if (!confirm('Viltu skrifa yfir skrána')) {
            return;
        }
    } else {
        dd.files.push(filename);
    }

    // Store filelist 
    dd.setFileList(dd.files);

    // the shapelist for drawing
    dd.saveFile(filename, JSON.stringify(dd.shapes));

    dd.modified = false;
    dd.undos.length = 0;
    dd.redos.length = 0;
    this.cancelFileUI();
};


dd.loadShapes = function(filename) {

    if (!filename) {
        alert('Veldu eða skráðu nafn til að hlaða inn!')
        return;
    }

    var loaded   = [],
        created  = [],
        factory,
        i;

    // Clear current shapelist
    this.shapes = [];

    // For now just a single possible save
    loaded = JSON.parse(dd.loadFile(filename));

    for (var i = 0; i < loaded.length; i++) {

        // Need to merge loaded object with it's child dim since factory expects a flat object
        // Conveniently jQuery has a method for this
        jQuery.extend(loaded[i], loaded[i].dim);

        // Get a new shape from the factory for this type
        factory = 'create' + loaded[i].type;
        this.shapes.push(dd[factory](loaded[i]));
    };

    dd.modified = false;
    dd.undos.length = 0;
    dd.redos.length = 0;
    this.cancelFileUI();
};

/*************************************************************
  File operation functions
  Implemented with localstorage but could be swapped out
*************************************************************/

// Loads the filename list from storage,
// Returns an array
dd.getFileList = function() {
    var fileString,
        files = [];

    // Get the list of saved files
    fileString = localStorage.getItem('dd.savedFiles');
    if (fileString) {
        files = fileString.split('|');
    }
    return files;
};

// Saves the filename list from storage,
dd.setFileList = function(files) {
    var fileString;

    fileString = files.join('|');

    // Store filelist 
    localStorage.setItem('dd.savedFiles', fileString);
};

// Remove file from storage.
dd.deleteFile = function(filename) {
    localStorage.removeItem('dd.' + filename);
};

// Store file permanently
dd.saveFile = function(filename, content) {
    localStorage.setItem('dd.' + filename, content);
};

// Load file from storage
dd.loadFile = function(filename) {
    return localStorage.getItem('dd.' + filename);
};
