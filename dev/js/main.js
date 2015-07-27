(function( ColorZebra, $, undefined ) {
    ColorZebra.main = function() {
        // Handle on-load stuff
        $(document).ready(function() {
            // Prepare our preview panel
            ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            
            ColorZebra.spline = new ColorZebra.SplineCanvas($('#spline')[0]);
            ColorZebra.spline.maximize();
            ColorZebra.spline.draw();
            
            assignActionHandlers();
        });
    }
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        $('#ch_hue').click(function() {
            ColorZebra.mainPreview.changeHue();
            ColorZebra.mainPreview.draw();
        });
        
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
        });
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));