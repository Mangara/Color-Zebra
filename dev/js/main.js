(function( ColorZebra, $, undefined ) {
    ColorZebra.colorMap = ColorZebra.colorMaps['Lake'];
    ColorZebra.numColors = 12;
    
    ColorZebra.main = function() {
        // Handle on-load stuff
        $(document).ready(function() {
            // Prepare our preview panel
            ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            
            ColorZebra.fixedNumPreview = new ColorZebra.FixedNumPreview($('#fixednum-preview')[0]);
            ColorZebra.fixedNumPreview.maximize();
            ColorZebra.fixedNumPreview.draw();
            
            fillDropdown();
            assignActionHandlers();
        });
    }
    
    // Adds all color maps to the dropdown
    function fillDropdown() {
        var select = $('<select>');
        $.each(ColorZebra.colorMaps, function(colorMapName, colorMapObject) {
            select.append(
                $('<option' + (colorMapObject === ColorZebra.colorMap ? ' selected' : '') + '></option>').html(colorMapName)
            );
        });
        $('#colormap-select-container').append('<select id="colormap-select">' + select.html() + '</select>');
    }
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        $('#colormap-select').change(function() {
            ColorZebra.colorMap = ColorZebra.colorMaps[$('#colormap-select').val()];
            
            ColorZebra.mainPreview.draw();
            ColorZebra.fixedNumPreview.draw();
        });
        
        $('#fixednum-apply').click(function() {
            ColorZebra.numColors = $('#numcolors').val();
            ColorZebra.fixedNumPreview.draw();
        });
        
        $('#download-csv').click(function() {
            download($('#download-csv')[0], 'csv', ColorZebra.exportCSV());
        });
        
        $('#download-ipe').click(function() {
            download($('#download-ipe')[0], 'plain', ColorZebra.exportIPE());
        });
        
        /* $('#download-css').click(function() {
            download($('#download-css')[0], 'css', ColorZebra.exportCSS());
        }); */
        
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            ColorZebra.fixedNumPreview.maximize();
            ColorZebra.fixedNumPreview.draw();
        });
    }
    
    // TODO: Use tricks from http://danml.com/download.html to make this work in other browsers
    function download(link, mimeType, fileContents) {
        link.href = 'data:text/' + mimeType + ';charset=utf-8,' + encodeURIComponent(fileContents);
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));