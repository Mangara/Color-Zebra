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

        $('#remove').click(function() {
            var selectedWidget = $('.selected').first();

            // Update min of neighbours
            var myLightnessInput = selectedWidget.children("input[type=number]").first();
            var myMin = myLightnessInput.attr('min');
            var myMax = myLightnessInput.attr('max');
            selectedWidget.prev().children("input[type=number]").first().attr('max', myMax);
            selectedWidget.next().children("input[type=number]").first().attr('min', myMin);

            var nextWidget = (selectedWidget.next().length ? selectedWidget.next() : selectedWidget.prev());
            selectedWidget.remove();
            selectWidget(nextWidget);

            updateColorMap();
        });

        $('#insert-before').click(function() {
            var selectedWidget = $('.selected').first();
            var color = getColor(selectedWidget);
            color[0]--;

            var min = (selectedWidget.prev().length ? getLightness(selectedWidget.prev()) + 1 : 0);
            var max = color[0];

            selectedWidget.prev().children("input[type=number]").first().attr('max', color[0] - 1);
            selectedWidget.children("input[type=number]").first().attr('min', color[0] + 1);

            var newWidget = createWidget(min, max);
            syncControlPointWidget(newWidget, color);

            selectedWidget.before(newWidget);

            selectWidget(newWidget);

            updateColorMap();
        });

        $('#insert-after').click(function() {
            var selectedWidget = $('.selected').first();
            var color = getColor(selectedWidget);
            color[0]++;

            var min = color[0];
            var max = (selectedWidget.next().length ? getLightness(selectedWidget.next()) - 1 : 0);

            selectedWidget.children("input[type=number]").first().attr('max', color[0] - 1);
            selectedWidget.next().children("input[type=number]").first().attr('min', color[0] + 1);

            var newWidget = createWidget(min, max);
            syncControlPointWidget(newWidget, color);

            selectedWidget.after(newWidget);

            selectWidget(newWidget);

            updateColorMap();
        });

        $('#lightness').change(function() {
            setWidgetLightness($('.selected').first(), $('#lightness').val());
        });

        $('#abControl').click(function(event) {
            var coords = getFractionalClickCoordinates(this, event);
            var minAB = -128, maxAB = 128;

            var a = Math.round(minAB + coords[0] * (maxAB - minAB));
            var b = Math.round(minAB + coords[1] * (maxAB - minAB));

            setWidgetAB($('.selected').first(), a, b);
        });

        $('#import').click(function(event) {
            $('#import').css('cursor', 'wait');
            var colors = parseImportList();
            var newMap = ColorZebra.importColorMap(colors);
            setColorMap(newMap);
            $('#import').css('cursor', 'default');
        });
    }

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

    function addActionHandlers(widget) {
        // React to changes in the control points
        widget.children('input[type="number"]').change(function() {
            var widget = $(this).parent();

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

        // Update selection
        widget.click(function() {
            selectWidget($(this));
        });
    }

    function createControlPointWidgets() {
        var points = ColorZebra.colorMap.getControlPoints();

        for (var i = 0, max = points.length; i < max; i++) {
            var minL = (i === 0 ? 0 : points[i - 1][0] + 1);
            var maxL = (i === points.length - 1 ? 100 : points[i + 1][0] - 1);
            var widget = createWidget(minL, maxL);
            $("#cp-widgets").append(widget);
            syncControlPointWidget(widget, points[i]);
        }

        selectWidget($('#cp-widgets').children().first());
    }

    function setColorMap(newMap) {
        ColorZebra.colorMap = newMap;

        ColorZebra.mainPreview.draw();

        $("#cp-widgets").empty();
        createControlPointWidgets(); // Updates color controls and button state
    }

    function updateColorMap() {
        var points = [];
        
        $('#cp-widgets').children().each(function() {
            points.push(getColor(this));
        });

        ColorZebra.colorMap = new ColorZebra.ColorMap(
            'Custom',
            'Custom color map',
            points,
            3
        );

        ColorZebra.mainPreview.draw();
    }

    function createWidget(minL, maxL) {
        var widget = $("<div class=control-point>" + 
            "<input type=number min=" + minL + " max=" + maxL + ">" +
            " <input type=number min=-128 max=128>" + 
            " <input type=number min=-128 max=128>" + 
            "</div>");
        addActionHandlers(widget);
        return widget;
    }

    function addControlPointWidget() {
        var newWidget = createWidget(0, 100);
        $("#cp-widgets").append(newWidget);
        return newWidget;
    }

    function syncControlPointWidget(widget, point) {
        var labTextfields = $(widget).children("input[type=number]");

        labTextfields[0].value = point[0];
        labTextfields[1].value = point[1];
        labTextfields[2].value = point[2];

        var color = ColorZebra.Color.LABtoCSS(point);

        $(widget).css("background-color", color);
    }

    function setWidgetLightness(widget, lightness) {
        var lightnessInput = $(widget).children("input[type=number]").first();

        if (lightnessInput.val() != lightness) {
            lightnessInput.val(lightness);
            lightnessInput.trigger('change');
        }
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

    function updateWidgetBackground(widget) {
        $(widget).css("background-color", ColorZebra.Color.LABtoCSS(getColor(widget)));  
    }

    function getColor(widget) {
        var labTextfields = $(widget).children("input[type=number]");
        return [parseInt(labTextfields[0].value), parseInt(labTextfields[1].value), parseInt(labTextfields[2].value)];
    }

    function getLightness(widget) {
        return parseInt($(widget).children("input[type=number]")[0].value);
    }

    function selectWidget(widget) {
        $('.selected').removeClass('selected');
        widget.addClass('selected');

        updateColorControls();
        updateButtonsEnabledState();
    }

    function updateColorControls() {
        var selectedWidget = $('.selected').first();
        var lightnessInput = selectedWidget.children("input[type=number]").first();
        var color = getColor(selectedWidget);

        // Update lightness slider values
        var lightnessSlider = $('#lightness').first();
        var min = parseInt(lightnessInput.attr('min'));
        var max = parseInt(lightnessInput.attr('max'));
        lightnessSlider.attr('min', min);
        lightnessSlider.attr('max', max);
        lightnessSlider.val(color[0]);

        // Update lightness slider background
        var start = 0.5;
        var end = 14.5;
        var nStops = 8;

        var rule = "background: linear-gradient(to right, ";

        for (var i = 0; i < nStops; i++) {
            var f = i / (nStops - 1);
            rule += ColorZebra.Color.LABtoCSS([min + f * (max - min), color[1], color[2]]);
            rule += " " + (start + f * (end - start)) + "em";

            if (i == nStops - 1) {
                rule += ");";
            } else {
                rule += ", ";
            }
        }

        $("#dynamic").text("#lightness::-webkit-slider-runnable-track { " + rule + " }");

        // Update color canvas
        var canvas = $('#abControl')[0];
        var context = canvas.getContext("2d"),
            x, y,
            width = canvas.width,
            height = canvas.height,
            minAB = -128,
            maxAB = 128;

        // Draw the background - the LAB color space for one specific L-value
        var imageData = context.createImageData(width, height);

        for (x = 0; x < width; x++) {
            var xt = x / (width - 1); // x mapped to [0, 1]
            var a = minAB + xt * (maxAB - minAB);
            
            for (y = 0; y < height; y++) {
                var yt = y / (height - 1);
                var b = minAB + yt * (maxAB - minAB);
                var rgb = ColorZebra.Color.LABtoIntegerRGB([color[0], a, b]);

                var pixel = (y * width + x) * 4;
                imageData.data[pixel    ] = rgb[0];
                imageData.data[pixel + 1] = rgb[1];
                imageData.data[pixel + 2] = rgb[2];
                imageData.data[pixel + 3] = 255; // opaque
            }
        }

        context.putImageData(imageData, 0, 0);

        // Draw the color curve
        for (var i = 0; i <= 1; i+=0.01) {
            var c = ColorZebra.colorMap.getLABColor(i);

            x = width * (c[1] - minAB) / (maxAB - minAB);
            y = height * (c[2] - minAB) / (maxAB - minAB);

            context.fillStyle = ColorZebra.Color.LABtoCSS(c);
            context.strokeStyle = (color[0] < 70 ? 'white' : 'black');
            context.lineWidth = 0.5;

            context.beginPath();
            context.arc(x, y, 4, 0, Math.PI * 2, true); // Circle
            context.fill();
            context.stroke();
        }

        // Draw the current color indicator
        x = width * (color[1] - minAB) / (maxAB - minAB);
        y = height * (color[2] - minAB) / (maxAB - minAB);

        context.fillStyle = ColorZebra.Color.LABtoCSS(color);
        context.strokeStyle = (color[0] < 70 ? 'white' : 'black');
        context.lineWidth = 2;

        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, true); // Circle
        context.fill();
        context.stroke();
    }

    function updateButtonsEnabledState() {
        var selectedWidget = $('.selected').first();
        var lightnessInput = selectedWidget.children("input[type=number]").first();
        var lightness = parseInt(lightnessInput.val());
        var min = parseInt(lightnessInput.attr('min'));
        var max = parseInt(lightnessInput.attr('max'));

        if (lightness <= min) {
            $('#insert-before').prop("disabled", true);
        } else {
            $('#insert-before').prop("disabled", false);
        }

        if (lightness >= max) {
            $('#insert-after').prop("disabled", true);
        } else {
            $('#insert-after').prop("disabled", false);
        }

        if ($('.control-point').length === 3) {
            $('#remove').prop("disabled", true);
        } else {
            $('#remove').prop("disabled", false);
        }
    }

    function parseImportList() {
        var lines = $('#import-list').val().split('\n');
        var colors = [];

        for (var i = 0; i < lines.length; i++) {
            var color = lines[i].split(',').map(Number);
            colors.push(color);
        }

        return colors;
    }

    // Handle on-load stuff
    $(document).ready(function() {
        // Add custom CSS so we can dynamically change slider styling
        $("<style id='dynamic'></style>").appendTo("head");

        // Prepare our preview panels
        ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
        ColorZebra.mainPreview.maximize();
        ColorZebra.mainPreview.draw();

        createControlPointWidgets();
        
        assignActionHandlers();
    });
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));