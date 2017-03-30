(function( ColorZebra, $, undefined ) {
    // Important variables with their initial values
    ColorZebra.colorMap = ColorZebra.colorMaps['Lake'];
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
        });
    }
    
    // Handle on-load stuff
    $(document).ready(function() {
        // Prepare our preview panels
        ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
        ColorZebra.mainPreview.maximize();
        ColorZebra.mainPreview.draw();
        
        assignActionHandlers();
    });
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));