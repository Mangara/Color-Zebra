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

            // Select next one, if available
            if (selectedWidget.next().length) {
                selectedWidget.next().addClass('selected');
            } else if (selectedWidget.prev().length) {
                selectedWidget.prev().addClass('selected');
            }

            selectedWidget.remove();

            updateColorMap();

            // TODO: check if more removal is allowed
        });

        $('#insert-before').click(function() {
            var newWidget = createWidget(0, 100);
            var selectedWidget = $('.selected').first();

            var color = getColor(selectedWidget);
            var pt = [color[0] - 1, 0, 0];
            syncControlPointWidget(newWidget, pt);

            selectedWidget.before(newWidget);

            selectedWidget.removeClass('selected');
            newWidget.addClass('selected');

            updateColorMap();

            // TODO: check if more can be inserted
        });

        $('#insert-after').click(function() {
            var newWidget = createWidget(0, 100);
            var selectedWidget = $('.selected').first();

            var color = getColor(selectedWidget);
            var pt = [color[0] + 1, 0, 0];
            syncControlPointWidget(newWidget, pt);

            selectedWidget.after(newWidget);

            selectedWidget.removeClass('selected');
            newWidget.addClass('selected');

            updateColorMap();

            // TODO: check if more can be inserted
        });
    }

    function addActionHandlers(widget) {
        // React to changes in the control points
        widget.children('input[type="number"]').change(function() {
            updateWidgetBackground($(this).parent());
            updateColorMap();
        });

        // Update selection
        widget.click(function() {
            $('.selected').removeClass('selected');
            $(this).addClass('selected');

            // TODO: check if lightness allows for insertion before/after
        });
    }

    function createControlPointWidgets() {
        var points = ColorZebra.colorMap.getControlPoints();

        for (var i = 0, max = points.length; i < max; i++) {
            var widget = createWidget(0, 100);
            $("#cp-widgets").append(widget);
            syncControlPointWidget(widget, points[i]);
        }

        $('#cp-widgets').children().first().addClass('selected');
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

    function updateWidgetBackground(widget) {
        $(widget).css("background-color", ColorZebra.Color.LABtoCSS(getColor(widget)));  
    }

    function getColor(widget) {
        var labTextfields = $(widget).children("input[type=number]");
        return [parseInt(labTextfields[0].value), parseInt(labTextfields[1].value), parseInt(labTextfields[2].value)];
    }

    // Handle on-load stuff
    $(document).ready(function() {
        // Prepare our preview panels
        ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
        ColorZebra.mainPreview.maximize();
        ColorZebra.mainPreview.draw();

        createControlPointWidgets();
        
        assignActionHandlers();
    });
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));