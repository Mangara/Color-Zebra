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
        $('#colormaps>button').each(function() {
            var map = ColorZebra.colorMaps[this.id];
            
            if (map === ColorZebra.colorMap) {
                $(this).addClass('selected');
            }
            
            var canvas = document.createElement("canvas");
            var width = Math.ceil($(this).outerWidth());
            canvas.width = width;
            canvas.height = 1;

            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                var imageData = ctx.createImageData(width, 1);
                
                for (var x = 0; x < width; x++) {
                    var val = x / (width - 1);
                    var rgb = ColorZebra.Color.LABtoIntegerRGB(map.getLABColor(val));
                    var pixel = x * 4;
                    imageData.data[pixel    ] = rgb[0];
                    imageData.data[pixel + 1] = rgb[1];
                    imageData.data[pixel + 2] = rgb[2];
                    imageData.data[pixel + 3] = 255; // opaque
                }

                ctx.putImageData(imageData, 0, 0);

                this.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
            }
            
            this.title = map.description;
        });
        
        createControlPointWidgets();
        
        assignActionHandlers();
    });
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
            ColorZebra.fixedNumPreview.maximize();
            ColorZebra.fixedNumPreview.draw();
        });

        // Change the active colormap when a thumbnail is clicked
        $('#colormaps>button').click(function() {
            var map = ColorZebra.colorMaps[this.id];
            
            if (ColorZebra.colorMap !== map) {
                // Switch the selected class
                deselectColormap();
                $(this).addClass('selected');
                
                // Switch maps
                setColorMap(map);
            }
        });
        
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

            $('#colormaps>button').toggleClass('inverted');
        });

        // Editor controls
        $('#remove').click(function() {
            var selectedWidget = getSelectedWidget();

            // Update min of neighbours
            var myLightnessInput = selectedWidget.children("input[type=number]").first();
            var myMin = myLightnessInput.attr('min');
            var myMax = myLightnessInput.attr('max');
            selectedWidget.prev().children("input[type=number]").first().attr('max', myMax);
            selectedWidget.next().children("input[type=number]").first().attr('min', myMin);

            var nextWidget = (selectedWidget.next().length ? selectedWidget.next() : selectedWidget.prev());
            selectedWidget.remove();
            selectWidget(nextWidget);

            updateColorMapFromEditor();
        });

        $('#insert-before').click(function() {
            var selectedWidget = getSelectedWidget();
            var color = getWidgetColor(selectedWidget);
            color[0]--;

            var min = (selectedWidget.prev().length ? getWidgetLightness(selectedWidget.prev()) + 1 : 0);
            var max = color[0];

            selectedWidget.prev().children("input[type=number]").first().attr('max', color[0] - 1);
            selectedWidget.children("input[type=number]").first().attr('min', color[0] + 1);

            var newWidget = createWidget(min, max);
            syncWidget(newWidget, color);

            selectedWidget.before(newWidget);

            selectWidget(newWidget);

            updateColorMapFromEditor();
        });

        $('#insert-after').click(function() {
            var selectedWidget = getSelectedWidget();
            var color = getWidgetColor(selectedWidget);
            color[0]++;

            var min = color[0];
            var max = (selectedWidget.next().length ? getWidgetLightness(selectedWidget.next()) - 1 : 0);

            selectedWidget.children("input[type=number]").first().attr('max', color[0] - 1);
            selectedWidget.next().children("input[type=number]").first().attr('min', color[0] + 1);

            var newWidget = createWidget(min, max);
            syncWidget(newWidget, color);

            selectedWidget.after(newWidget);

            selectWidget(newWidget);

            updateColorMapFromEditor();
        });

        $('#lightness').on('input', function() {
            setWidgetLightness(getSelectedWidget(), this.value);
        });

        var abDrag = false;
        $('#abControl').mousedown(function(event) {
            abDrag = true;
            changeAB(getFractionalClickCoordinates(this, event));
        }).mousemove(function(event) {
            if (abDrag) {
                changeAB(getFractionalClickCoordinates(this, event));
            }
        }).mouseup(function(event) {
            abDrag = false;
        });

        function getFractionalClickCoordinates(element, event) {
            var offsetX = 0, offsetY = 0;
            var el = element;

            while (el.offsetParent) {
                offsetX += el.offsetLeft;
                offsetY += el.offsetTop;
                el = el.offsetParent;
            }

            var x = (event.pageX - offsetX) / element.scrollWidth;
            var y = (event.pageY - offsetY) / element.scrollHeight;

            return [x, y];
        }

        function changeAB(coords) {
            var a = Math.round(minAB + coords[0] * (maxAB - minAB));
            var b = Math.round(minAB + coords[1] * (maxAB - minAB));

            setWidgetAB(getSelectedWidget(), a, b);
        }
    }
    
    function deselectColormap() {
        $('#colormaps>.selected').removeClass('selected');
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
            updateColorMapFromEditor();

            if ($(this).is(':first-child')) {
                // The lightness changed
                updateLightnessControls();
                updateButtonsEnabledState();

                var newVal = parseInt($(this).val());

                widget.prev().children("input[type=number]").first().attr('max', newVal - 1);
                widget.next().children("input[type=number]").first().attr('min', newVal + 1);
            } else {
                updateABControls();
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

    function getSelectedWidget() {
        return $('#cp-widgets>.selected').first();
    }
    
    function selectWidget(widget) {
        getSelectedWidget().removeClass('selected');
        widget.addClass('selected');

        updateColorControls();
        updateButtonsEnabledState();
    }
    
    function updateColorControls() {
        updateLightnessControls();
    }

    function updateLightnessControls() {
        var selectedWidget = getSelectedWidget();
        var color = getWidgetColor(selectedWidget);
        
        updateLightnessSlider(selectedWidget, color);

        var bgCanvas = $('#abBackground')[0];
        drawColorCanvasBackground(bgCanvas.getContext("2d"), color[0], bgCanvas.width, bgCanvas.height);

        updateABControls();
    }

    function updateABControls() {
        var color = getWidgetColor(getSelectedWidget());
        var canvas = $('#abControl')[0];
        var context = canvas.getContext("2d"),
            width = canvas.width,
            height = canvas.height;

        context.clearRect(0, 0, width, height);
        drawColorCanvasCurve(context, color, width, height);
        drawColorCanvasIndicator(context, color, width, height);
    }
    
    function updateLightnessSlider(selectedWidget, color) {
        var lightnessInput = selectedWidget.children("input[type=number]").first();
        var min = parseInt(lightnessInput.attr('min'));
        var max = parseInt(lightnessInput.attr('max'));
        
        // Update slider values
        var lightnessSlider = $('#lightness').first();
        lightnessSlider.attr('min', min);
        lightnessSlider.attr('max', max);
        lightnessSlider.val(color[0]);
        
        // Update slider background
        var start = 0.5;
        var end = 14.5;
        var nStops = 8;

        var rule = "background: linear-gradient(to right, ";

        for (var i = 0; i < nStops; i++) {
            var f = i / (nStops - 1);
            rule += ColorZebra.Color.LABtoCSS([min + f * (max - min), color[1], color[2]]);
            rule += " " + (start + f * (end - start)) + "em";
            rule += (i == nStops - 1 ? ");" : ", ");
        }

        $("#dynamic").text("#lightness::-webkit-slider-runnable-track { " + rule + " }");
    }
    
    var minAB = -128;
    var maxAB =  128;
    
    function drawColorCanvasBackground(context, lightness, width, height) {
        var imageData = context.createImageData(width, height);

        for (var x = 0; x < width; x++) {
            var xt = x / (width - 1); // x mapped to [0, 1]
            var a = minAB + xt * (maxAB - minAB);
            
            for (var y = 0; y < height; y++) {
                var yt = y / (height - 1);
                var b = minAB + yt * (maxAB - minAB);
                var rgb = ColorZebra.Color.LABtoIntegerRGB([lightness, a, b]);

                var pixel = (y * width + x) * 4;
                imageData.data[pixel    ] = rgb[0];
                imageData.data[pixel + 1] = rgb[1];
                imageData.data[pixel + 2] = rgb[2];
                imageData.data[pixel + 3] = 255; // opaque
            }
        }

        context.putImageData(imageData, 0, 0);
    }
    
    function drawColorCanvasCurve(context, color, width, height) {
        for (var i = 0; i <= 1; i+=0.01) {
            var c = ColorZebra.colorMap.getLABColor(i);
            var x = width * (c[1] - minAB) / (maxAB - minAB);
            var y = height * (c[2] - minAB) / (maxAB - minAB);
            
            drawColorCanvasCircle(context, c, color[0], 0.5, x, y, 4);
        }
    }
    
    function drawColorCanvasIndicator(context, color, width, height) {
        var x = width * (color[1] - minAB) / (maxAB - minAB);
        var y = height * (color[2] - minAB) / (maxAB - minAB);
        
        drawColorCanvasCircle(context, color, color[0], 2, x, y, 10);
    }
    
    function drawColorCanvasCircle(context, fillColor, lightness, thickness, x, y, radius) {
        context.fillStyle = ColorZebra.Color.LABtoCSS(fillColor);
        context.strokeStyle = (lightness < 70 ? 'white' : 'black');
        context.lineWidth = thickness;

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, true);
        context.fill();
        context.stroke();
    }
    
    function updateButtonsEnabledState() {
        var selectedWidget = getSelectedWidget();
        var lightnessInput = selectedWidget.children('input[type=number]').first();
        var lightness = parseInt(lightnessInput.val());
        var min = parseInt(lightnessInput.attr('min'));
        var max = parseInt(lightnessInput.attr('max'));

        $('#insert-before').prop("disabled", lightness <= min);
        $('#insert-after').prop("disabled", lightness >= max);
        $('#remove').prop("disabled", $('.control-point').length === 3);
    }
    
    function setColorMap(newMap) {
        ColorZebra.colorMap = newMap;

        ColorZebra.mainPreview.draw();
        ColorZebra.fixedNumPreview.draw();

        $("#cp-widgets").empty();
        createControlPointWidgets(); // Updates color controls and button state
    }
    
    function updateColorMapFromEditor() {
        var points = $('#cp-widgets').children().get().map(getWidgetColor);

        ColorZebra.colorMap = new ColorZebra.ColorMap(
            'Custom',
            'Custom color map',
            points,
            3
        );
        
        deselectColormap();

        ColorZebra.mainPreview.draw();
        ColorZebra.fixedNumPreview.draw();
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));