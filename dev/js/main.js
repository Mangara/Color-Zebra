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
            
            // Create all thumbnails
            $('#colormaps>canvas').each(function() {
                var map = ColorZebra.colorMaps[this.id];
                map.canvas = new ColorZebra.CMapDrawer(this, map);
                
                if (map === ColorZebra.colorMap) {
                    map.canvas.setDesaturate(false);
                    $(this).addClass('selected');
                }
                
                map.canvas.draw();
                
                this.title = map.description;
            });
            
            assignActionHandlers();
        });
    }
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        $('#colormaps>canvas').click(function() {
            var map = ColorZebra.colorMaps[this.id];
            
            if (ColorZebra.colorMap !== map) {
                // Saturate the thumbnail
                map.canvas.setDesaturate(false);
                map.canvas.draw();
                
                // Switch the selected class
                $('#colormaps>.selected').removeClass('selected');
                $(this).addClass('selected');
                
                // Desaturate the current thumbnail
                ColorZebra.colorMap.canvas.setDesaturate(true);
                ColorZebra.colorMap.canvas.draw();
                
                // Switch maps
                ColorZebra.colorMap = map;
                
                // Redraw stuff
                ColorZebra.mainPreview.draw();
                ColorZebra.fixedNumPreview.draw();
            }
        });
        
        $('#colormaps>canvas').hover(function() {
            var map = ColorZebra.colorMaps[this.id];
            
            // Saturate the thumbnail
            map.canvas.setDesaturate(false);
            map.canvas.draw();
        },
        function() {
            var map = ColorZebra.colorMaps[this.id];
            
            // Desaturate the thumbnail
            if (ColorZebra.colorMap !== map) {
                map.canvas.setDesaturate(true);
                map.canvas.draw();
            }
        });
        
        $('#numcolors').keypress(function(e) {
            if (e.which == 13) {
                ColorZebra.numColors = $('#numcolors').val();
                ColorZebra.fixedNumPreview.draw();
            }
        });
        
        $('#fixednum-apply').click(function() {
            ColorZebra.numColors = $('#numcolors').val();
            ColorZebra.fixedNumPreview.draw();
        });
        
        $('#download-csv-int').click(function() {
            download(this, 'csv', ColorZebra.exportIntegerCSV());
        });
        
        $('#download-csv-float').click(function() {
            download(this, 'csv', ColorZebra.exportFloatCSV());
        });
        
        $('#download-ipe').click(function() {
            download(this, 'plain', ColorZebra.exportIPE());
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