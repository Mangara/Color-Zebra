(function( ColorZebra, $, undefined ) {
    // Important variables with their initial values
    ColorZebra.colorMap = ColorZebra.colorMaps['Lake'];
    ColorZebra.numColors = 12;
    
    // Handle on-load stuff
    $(document).ready(function() {
        // Init settings
        ColorZebra.settings = new ColorZebra.Settings(false);

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
        
        createControlPointWidgets();
        
        assignActionHandlers();
    });
    
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
        }).hover(function() { // Saturate hovered and focused thumbnails
            saturateThumbnail(this);
        }, function() {
            desaturateThumbnail(this);
        }).focus(function() {
            saturateThumbnail(this);
        }).blur(function() {
            desaturateThumbnail(this);
        }).keydown(function(e) { // React to key events when focused
            var code = e.which; // 13 = Enter, 32 = Space
            if ((code === 13) || (code === 32)) {
                $(this).click();
                return false; // Prevent the event from bubbling further
            }
        });
        
        function saturateThumbnail(thumbnail) {
            var canvas = ColorZebra.colorMaps[thumbnail.id].canvas;
            canvas.setDesaturate(false);
            canvas.draw();
        }
        
        function desaturateThumbnail(thumbnail) {
            var map = ColorZebra.colorMaps[thumbnail.id];
            
            if (ColorZebra.colorMap !== map) {
                map.canvas.setDesaturate(true);
                map.canvas.draw();
            }
        }
        
        // Update the number of colors
        $('#numcolors').keydown(function(e) {
            if (e.which === 13) {
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
        
        // Make the download link work
        $('#download').click(function() {
            switch ($('#format').val()) {
                case 'csv-int':
                    download(this, 'csv', 'csv', ColorZebra.exportIntegerCSV());
                    break;
                case 'csv-float':
                    download(this, 'csv', 'csv', ColorZebra.exportFloatCSV());
                    break;
                case 'ipe':
                    download(this, 'plain', 'isy', ColorZebra.exportIPE());
                    break;
            } 
        });
        
        function download(link, mimeType, extension, fileContents) {
            // Based on "download.js" v4.0, by dandavis; 2008-2015. [CCBY] see http://danml.com/download.html
            if (navigator.msSaveBlob) { // IE10 can't do a[download], only Blobs
                var blob = new Blob([fileContents], {type: 'text/' + mimeType});
                navigator.msSaveBlob(blob, 'colormap.' + extension);
            } else if ('download' in link) { // HTML5 a[download]
                link.href = 'data:text/' + mimeType + ';charset=utf-8,' + encodeURIComponent(fileContents);
                link.download = 'colormap.' + extension;
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

        $('#settings-toggle').click(function() {
            $('#settings').slideToggle(500);
            $('#settings-toggle>i').html(
                $('#settings-toggle>i').html() === 'expand_more' ? 'expand_less' : 'expand_more'
            );
        });

        $('#invert').click(function() {
            ColorZebra.settings.inverted = !ColorZebra.settings.inverted;

            // Redraw stuff
            ColorZebra.mainPreview.draw();
            ColorZebra.fixedNumPreview.draw();

            $('#colormaps>canvas').each(function() {
                var map = ColorZebra.colorMaps[this.id];
                map.canvas.draw();
            });
        });
    }
    
    function createControlPointWidgets() {
        var points = ColorZebra.colorMap.getControlPoints();

        for (var i = 0, max = points.length; i < max; i++) {
            var minL = (i === 0 ? 0 : points[i - 1][0] + 1);
            var maxL = (i === points.length - 1 ? 100 : points[i + 1][0] - 1);
            var widget = createWidget(minL, maxL);
            syncWidget(widget, points[i]);
            $("#cp-widgets").append(widget);
        }

        selectWidget($('#cp-widgets').children().first());
    }
    
    function createWidget(minL, maxL) {
        var widget = $("<div class=control-point>" + 
            "<input type=number min=" + minL + " max=" + maxL + "> " +
            "<input type=number min=-128 max=128> " + 
            "<input type=number min=-128 max=128>" + 
            "</div>");
        
        // Update selection
        widget.click(function() {
            selectWidget($(this));
        });
        
        // React to changes in the control points
        widget.children('input[type="number"]').change(function() {
            var widget = $(this).parent(); // TODO: is this necessary?

            updateWidgetBackground(widget);
            updateColorMap();
            updateColorControls();

            if ($(this).is(':first-child')) {
                // The lightness changed
                updateButtonsEnabledState();

                var newVal = parseInt($(this).val());

                widget.prev().children("input[type=number]").first().attr('max', newVal - 1);
                widget.next().children("input[type=number]").first().attr('min', newVal + 1);
            }
        });
        
        return widget;
    }
    
    function syncWidget(widget, point) {
        var labTextfields = $(widget).children("input[type=number]");

        labTextfields[0].value = point[0];
        labTextfields[1].value = point[1];
        labTextfields[2].value = point[2];

        updateWidgetBackground(widget);
    }
    
    function updateWidgetBackground(widget) {
        $(widget).css("background-color", ColorZebra.Color.LABtoCSS(getWidgetColor(widget)));
    }
    
    function getWidgetColor(widget) {
        return $(widget).children("input[type=number]").get().map(x => parseInt(x.value));
    }
    
    function setWidgetAB(widget, a, b) {
        var labTextfields = $(widget).children("input[type=number]");
        var changed = false;

        if (labTextfields.eq(1).val() != a) {
            changed = true;
            labTextfields.eq(1).val(a);
        }

        if (labTextfields.eq(2).val() != b) {
            changed = true;
            labTextfields.eq(2).val(b);
        }

        if (changed) {
            labTextfields.eq(1).trigger('change');
        }
    }

    function getWidgetLightness(widget) {
        return parseInt($(widget).children("input[type=number]")[0].value);
    }
    
    function setWidgetLightness(widget, lightness) {
        var lightnessInput = $(widget).children("input[type=number]").first();

        if (lightnessInput.val() != lightness) {
            lightnessInput.val(lightness);
            lightnessInput.trigger('change');
        }
    }
    
    function selectWidget(widget) {
        $('#cp-widgets>.selected').removeClass('selected');
        widget.addClass('selected');

        updateColorControls();
        updateButtonsEnabledState();
    }
    
    function updateColorControls() {
        // TODO
    }
    
    function updateButtonsEnabledState() {
        // TODO
    }
    
    function setColorMap(newMap) {
        ColorZebra.colorMap = newMap;

        ColorZebra.mainPreview.draw();
        ColorZebra.fixedNumPreview.draw();

        $("#cp-widgets").empty();
        createControlPointWidgets(); // Updates color controls and button state
    }
    
    function updateColorMap() {
        var points = $('#cp-widgets').children().map(getWidgetColor);

        ColorZebra.colorMap = new ColorZebra.ColorMap(
            'Custom',
            'Custom color map',
            points,
            3
        );

        ColorZebra.mainPreview.draw();
        ColorZebra.fixedNumPreview.draw();
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));