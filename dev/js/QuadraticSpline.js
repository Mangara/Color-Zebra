(function( ColorZebra, $, undefined ) {
    ColorZebra.QuadraticSpline = function(controlPoints) {
        var points = controlPoints; // Monotonically increasing lightness
        
        this.getColorForLightness = function(l) {
            if (l < points[0][0] || l > points[points.length - 1][0]) {
                return null;
            }
            if (l == points[points.length - 1][0]) {
                return points[points.length - 1];
            }
            
            // Binary search for interval containing l
            // Invariants:
            //    lightness of points[start] <= l
            //    lightness of points[end] > l
            var start = 0, end = points.length - 1;
            
            while (end - start > 1) {
                var middle = Math.floor(start + (end - start) / 2);
                var midVal = points[middle][0];
                
                if (midVal <= l) {
                    start = middle;
                } else {
                    end = middle;
                }
            }
            // Now: lightness of points[start] <= l < lightness of points[start + 1]
            
            
        }
        
        function solveQuadraticEquation(a, b, c) {
            var D = b * b - 4 * a * c;
            
            if (D < 0) {
                return [];
            } else if (D == 0) {
                return [-b / (2 * a)];
            } else {
                var sqrtD = Math.sqrt(D);
                return [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)];
            }
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));