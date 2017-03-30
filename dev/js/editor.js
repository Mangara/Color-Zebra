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

        $('.control-point>input[type="number"]').change(function() {
            console.log('changed');
        });

        $('#apply').click(function() {
            updateColorMap();
        });
    }

    function updateColorMap() {
        var points = [];

        for (var i = 0, max = ColorZebra.cpWidgets.length; i < max; i++) {
            var labTextfields = $(ColorZebra.cpWidgets[i]).children("input[type=number]");
            points.push([parseInt(labTextfields[0].value), parseInt(labTextfields[1].value), parseInt(labTextfields[2].value)]);
        }

        console.log('points: ' + points.join('\n'));
        console.log('map points: ' + ColorZebra.colorMap.getControlPoints().join('\n'));

        ColorZebra.colorMap = new ColorZebra.ColorMap(
            'Custom',
            'Custom color map',
            points,
            3
        );

        ColorZebra.mainPreview.draw();
    }
    
    function syncControlPointWidgets() {
        if (!ColorZebra.cpWidgets) {
            ColorZebra.cpWidgets = [];
        }

        var points = ColorZebra.colorMap.getControlPoints();

        if (ColorZebra.cpWidgets.length != points.length) {
            while (ColorZebra.cpWidgets.length < points.length) {
                addControlPointWidget();
            }

            while (ColorZebra.cpWidgets.length > points.length) {
                removeControlPointWidget();
            }
        }

        for (var i = 0, max = points.length; i < max; i++) {
            syncControlPointWidget(ColorZebra.cpWidgets[i], points[i]);
        }
    }

    function addControlPointWidget() {
        var newWidget = $("<div class=control-point><input type=number min=0 max=100> <input type=number min=-128 max=128> <input type=number min=-128 max=128> <input type=color></div>");
        $("#cp-widgets").append(newWidget);
        ColorZebra.cpWidgets.push(newWidget);
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

        $(widget).children("input[type=color]")[0].value = ColorZebra.Color.LABtoHEX(point);
    }

    // Handle on-load stuff
    $(document).ready(function() {
        // Prepare our preview panels
        ColorZebra.mainPreview = new ColorZebra.Preview($('#preview')[0]);
        ColorZebra.mainPreview.maximize();
        ColorZebra.mainPreview.draw();

        syncControlPointWidgets();
        
        assignActionHandlers();
    });
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));