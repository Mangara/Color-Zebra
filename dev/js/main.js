(function( ColorZebra, $, undefined ) {
    var INITIAL_COLORMAP = ColorZebra.colorMaps['Lake'];
    
    ColorZebra.main = function() {
        // Handle on-load stuff
        $(document).ready(function() {
            // Prepare our preview panel
            ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
            ColorZebra.mainPreview.setColorMap(INITIAL_COLORMAP);
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            
            fillDropdown();
            assignActionHandlers();
        });
    }
    
    // Adds all color maps to the dropdown
    function fillDropdown() {
        var select = $('<select>');
        $.each(ColorZebra.colorMaps, function(colorMapName, colorMap) {
            select.append(
                $('<option' + (colorMap === INITIAL_COLORMAP ? ' selected' : '') + '></option>').html(colorMapName)
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