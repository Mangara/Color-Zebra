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
            
            var s = new ColorZebra.LinearSpline([ [12.973, 47.505, -64.705], [97.139, -21.558, 94.477] ]);
            
            var c = new ColorZebra.Color([97.139, -21.558, 94.477]);
            console.log(c.toRGB());
            console.log(ColorZebra.Color.LABtoRGB([12.973, 47.505, -64.705]));
            
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