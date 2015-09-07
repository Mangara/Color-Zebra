(function( ColorZebra, $, undefined ) {
    ColorZebra.main = function() {
        // Handle on-load stuff
        $(document).ready(function() {
            // Prepare our preview panel
            ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            
            /*ColorZebra.spline = new ColorZebra.SplineCanvas($('#spline')[0]);
            ColorZebra.spline.maximize();
            ColorZebra.spline.draw();
            
            var s = new ColorZebra.LinearSpline([ [12.973, 47.505, -64.705], [97.139, -21.558, 94.477] ]);
            
            ColorZebra.Color.test();*/
            
            fillDropdown();
            assignActionHandlers();
        });
    }
    
    // Adds all color maps to the dropdown
    function fillDropdown() {
        var select = $('<select>');
        $.each(ColorZebra.colorMaps, function(colorMapName, colorMap) {
            select.append(
                $('<option></option>').html(colorMapName) /*.val(colorMap)*/
            );
        });
        $('#colormap-select-container').append('<select id="colormap-select">' + select.html() + '</select>');
    }
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        $('#colormap-select').change(function() {
            ColorZebra.mainPreview.setColorMap(ColorZebra.colorMaps[$('#colormap-select').val()]);
            ColorZebra.mainPreview.draw();
            
            console.log('Change triggered with: ' + $('#colormap-select').val());
        });
        
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
        });
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));