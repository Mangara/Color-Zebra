(function( ColorZebra, $, undefined ) {
    // Important variables with their initial values
    ColorZebra.colorMap = ColorZebra.colorMaps['Lake'];
    var selectedWidget = 0;
    
    // Assign all action handlers at startup
    function assignActionHandlers() {
        // Make our canvases respond to window resizing
        $(window).resize(function() {
            ColorZebra.mainPreview.maximize();
            ColorZebra.mainPreview.draw();
        });

        // React to changes in the control points
        $('.control-point>input[type="number"]').change(function() {
            updateColorMap();
            updateWidgetBackground($(this).parent());
        });

        $('.control-point').click(function() {
            $(ColorZebra.cpWidgets[selectedWidget]).removeClass('selected');
            selectedWidget = ColorZebra.cpWidgets.indexOf(this);
            $(this).addClass('selected');
        });

        $('#remove').click(function() {
            
        });

        $('#insert-before').click(function() {
            
        });

        $('#insert-after').click(function() {
            
        });
    }

    function createControlPointWidgets() {
        if (!ColorZebra.cpWidgets) {
            ColorZebra.cpWidgets = [];
        }

        var points = ColorZebra.colorMap.getControlPoints();

        for (var i = 0, max = points.length; i < max; i++) {
            var widget = addControlPointWidget();
            syncControlPointWidget(widget, points[i]);
        }

        selectedWidget = 0;
        ColorZebra.cpWidgets[0].addClass('selected');
    }

    function updateColorMap() {
        var points = [];

        for (var i = 0, max = ColorZebra.cpWidgets.length; i < max; i++) {
            points.push(getColor(ColorZebra.cpWidgets[i]));
        }

        ColorZebra.colorMap = new ColorZebra.ColorMap(
            'Custom',
            'Custom color map',
            points,
            3
        );

        ColorZebra.mainPreview.draw();
    }

    function addControlPointWidget() {
        var newWidget = $("<div class=control-point><input type=number min=0 max=100> <input type=number min=-128 max=128> <input type=number min=-128 max=128></div>");
        $("#cp-widgets").append(newWidget);
        ColorZebra.cpWidgets.push(newWidget);
        return newWidget;
    }

    function removeControlPointWidget() {
        var lastWidget = ColorZebra.cpWidgets.pop();
        lastWidget.remove();
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