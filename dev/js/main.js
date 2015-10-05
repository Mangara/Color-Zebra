(function( ColorZebra, $, undefined ) {
    ColorZebra.colorMap = ColorZebra.colorMaps['Lake'];
    ColorZebra.numColors = 12;
    
    ColorZebra.main = function() {
        // Handle on-load stuff
        $(document).ready(function() {
            // Prepare our preview panels
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
        // Change the active colormap when a thumbnail is clicked
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
        
        // Saturate the hovered thumbnails
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
        
        // Update the number of colors
        $('#numcolors').keypress(function(e) {
            if (e.which == 13) {
                updateNumColors();
            }
        });
        
        $('#fixednum-apply').click(function() {
            updateNumColors();
        });
        
        function updateNumColors() {
            ColorZebra.numColors = $('#numcolors').val();
            ColorZebra.fixedNumPreview.draw();
        }
        
        // Make the download links work
        $('#download-csv-int').click(function() {
            download(this, 'csv', 'csv', ColorZebra.exportIntegerCSV());
        });
        
        $('#download-csv-float').click(function() {
            download(this, 'csv', 'csv', ColorZebra.exportFloatCSV());
        });
        
        $('#download-ipe').click(function() {
            download(this, 'plain', 'isy', ColorZebra.exportIPE());
        });
        
        /* $('#download-css').click(function() {
            download($('#download-css')[0], 'css', ColorZebra.exportCSS());
        }); */
        
        function download(link, mimeType, extension, fileContents) {
            // Based on "download.js" v4.0, by dandavis; 2008-2015. [CCBY] see http://danml.com/download.html
            
            if (navigator.msSaveBlob) { // IE10 can't do a[download], only Blobs
                var blob = new Blob([fileContents], {type: 'text/' + mimeType});
                navigator.msSaveBlob(blob, 'colormap.' + extension);
            } else if ('download' in link) { // HTML5 a[download]
                link.href = 'data:text/' + mimeType + ';charset=utf-8,' + encodeURIComponent(fileContents);
            } else if (typeof safari !== undefined) { // Handle non-a[download] safari as best we can:
				var url = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(fileContents);
                
				if (!window.open(url)) { // Popup blocked, offer direct download:
					if (confirm('Displaying New Document\n\nUse Save As... to download, then click back to return to this page.')) { 
                        location.href=url;
                    }
				}
			} else { // None of these download options are supported. Just show the text and allow them to copy it.
                
            }
        }
        
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            ColorZebra.fixedNumPreview.maximize();
            ColorZebra.fixedNumPreview.draw();
        });
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));