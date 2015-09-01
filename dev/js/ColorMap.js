(function( ColorZebra, $, undefined ) {
    ColorZebra.ColorMap = function(name, description, controlPoints, splineOrder) {
        this.name = name;
        this.description = description;
        
        var points = controlPoints;
        var spline;
        
        if (splineOrder == 2) {
            spline = new ColorZebra.LinearSpline(controlPoints);
        } else if (splineOrder == 3) {
            spline = new ColorZebra.QuadraticSpline(controlPoints);
        }
        
        this.getCSSColor = function(value) {
            return ColorZebra.Color.LABtoCSS(spline.getColorForLightness(normalizeLightness(value)));
        }
        
        function normalizeLightness(value) {
            return points[0][0] + value * (points[points.length - 1][0] - points[0][0]);
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));