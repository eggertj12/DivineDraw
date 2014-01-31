/*globals dd*/
/*jslint indent: 4 */

/***********************************************
    Extend dd object with functions for 
    handling commands
***********************************************/

dd.newDrawing = function() {
    
    // For now just trash everything
    // Should really give some warning
    if (confirm('Viltu henda teikningu?')) {
        this.shapes = [];
        this.activeShape = null;
    }
}

dd.cancelFileUI = function() {
    jQuery('section#fileUI').css('display', 'none');
}

dd.filenameClicked = function() {
    jQuery('input#fileName').val(jQuery(this).text());
}

dd.files = [],

dd.getFileList = function() {
    var fileString,
        files = [];

    // Get the list of saved files
    fileString = localStorage.getItem('dd.savedFiles');
    if (fileString) {
        files = fileString.split('|');
    }
    return files;
},

dd.saveDrawing = function() {
    this.files = this.getFileList();

    // Build file list UI
    jQuery('ul#files').empty();
    for (var i = dd.files.length - 1; i >= 0; i--) {
        jQuery('ul#files').append('<li>' + dd.files[i] + '</li>');
    };
    jQuery('ul#files li').on('click', this.filenameClicked);

    // Adjust UI to saving
    jQuery('button#fileLoad').css('display', 'none');
    jQuery('button#fileSave').css('display', 'inline-block');
    jQuery('input#fileName').removeAttr('disabled');
    jQuery('aside#filebox h1').text('Vista teikningu');

    // Show file UI
    jQuery('section#fileUI').css('display', 'block');
}

dd.loadDrawing = function() {
    this.files = this.getFileList();

    // Build file list UI
    jQuery('ul#files').empty();
    for (var i = dd.files.length - 1; i >= 0; i--) {
        jQuery('ul#files').append('<li>' + dd.files[i] + '</li>');
    };
    jQuery('ul#files li').on('click', this.filenameClicked);

    // Adjust UI to saving
    jQuery('button#fileLoad').css('display', 'inline-block');
    jQuery('button#fileSave').css('display', 'none');
    jQuery('input#fileName').attr('disabled', 'disabled');
    jQuery('aside#filebox h1').text('Hlaða teikningu');

    // Show file UI
    jQuery('section#fileUI').css('display', 'block');
}

dd.saveShapes = function(filename) {

    if (!filename) {
        alert('Veldu eða skráðu nafn til að vista undir!')
        return;
    }

    var fileString;

    if (dd.files.indexOf(filename) !== -1) {

        // Filname exists
        if (!confirm('Viltu skrifa yfir skrána')) {
            return;
        }
    } else {
        dd.files.push(filename);
    }
    fileString = dd.files.join('|');
    console.log('fileString: ' + fileString);

    // Store filelist 
    localStorage.setItem('dd.savedFiles', fileString);

    // the shapelist for drawing
    localStorage.setItem('dd.' + filename, JSON.stringify(this.shapes));

    this.cancelFileUI();
}


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
    loaded = JSON.parse(localStorage.getItem('dd.' + filename));

    for (var i = 0; i < loaded.length; i++) {

        // Need to merge loaded object with it's child dim since factory expects a flat object
        // Conveniently jQuery has a method for this
        jQuery.extend(loaded[i], loaded[i].dim);

        // Get a new shape from the factory for this type
        factory = 'create' + loaded[i].type;
        this.shapes.push(dd[factory](loaded[i]));
    };

    this.cancelFileUI();
}
