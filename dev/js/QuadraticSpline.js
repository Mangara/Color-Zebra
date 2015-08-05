(function( ColorZebra, $, undefined ) {
    ColorZebra.QuadraticSpline = function(controlPoints) {
        var n = controlPoints.length;
        var points = controlPoints.unshift(null); // Monotonically increasing lightness, starting with index 1
        var coefficients = computeCoefficients();
        
        this.getColorForLightness = function(l) {
            if (l < points[1][0] || l > points[points.length - 1][0]) {
                return null;
            }
            if (l == points[points.length - 1][0]) {
                return points[points.length - 1];
            }
            
            // Binary search for interval containing l
            // Invariants:
            //    lightness of points[start] <= l
            //    lightness of points[end] > l
            var start = 1, end = points.length - 1;
            
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
            
            // Interval [j - 1, j] depends on control points p_j, p_{j+1}, and p_{j+2}
            // So if the lightness value lies between that of p_{start} and p_{start+1}
            // Then it lies in interval [start - 1, start], which depends on p_{start}, p_{start+1}, and p_{start+2},
            // or in interval [start - 2, start - 1], which depends on p_{start-1}, p_{start}, and p_{start+1}
            
            var sol = null;
            
            // Try the earlier interval first
            if (start > 1) {
                sol = findLightnessInInterval(l, start - 1);
            }

            if (sol === null || sol.length === 0) {
                sol = findLightnessInInterval(l, start);
            }
            
            if (sol === null || sol.length === 0) {
                console.log('Error: no point on spline found with lightness ' + l);
                return null;
            }
            
            // We found the correct parameter value: now simply evaluate the spline
            var x = sol[0];
            
            // TODO: evaluate and cast to color
        }
        
        function findLightnessInInterval(l, intervalEnd) {
            return solveQuadraticEquation(
                coefficients[intervalEnd][0],
                coefficients[intervalEnd][1],
                coefficients[intervalEnd][2] - l);
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
        
        function computeCoefficients() {
            // This is a cardinal spline, so the knot vector is implicitly defined as [0, 0, 0, 1, 2, ..., n - 3, n - 2, n - 2, n - 2]
            // coefficients[i] contains the coefficients of the quadratic equation for the piece of the spline with parameter value in [i - 1, i]
            // See misc/QuadraticSpline.ipe for the derivation
            var c = [];
            
            c[1] = [
                ( 2 * points[1][0] - 3 * points[2][0] + points[3][0])/2,
                (-4 * points[1][0] + 4 * points[2][0])/2,
                ( 2 * points[1][0])/2
            ];
            
            var j;
            for (j = 2; j < n - 2; i++) {
                c[j] = [
                    (points[j][0] - 2 * points[j+1][0] + points[j+2][0])/2,
                    (-2 * j * points[j][0] + (4 * j - 2) * points[j+1][0] + (2 - 2 * j) * points[j+2][0])/2,
                    (j * j * points[j][0] + (-2 * j * j + 2 * j + 1) * points[j+1][0] + (j * j - 2 * j + 1) * points[j+2][0])/2
                ];
            }
            
            c[n - 2] = [
                (points[n-2][0] - 3 * points[n-1][0] + 2 * points[n][0])/2,
                ((4 - 2 * n) * points[n-2][0] + (6 * n - 16) * points[n-1][0] + (12 - 4 * n) * points[n][0])/2,
                ((n * n - 4 * n + 4) * points[n-2][0] + (-3 * n * n + 16 * n - 20) * points[n-1][0] + (2 * n * n - 12 * n + 18) * points[n][0])/2
            ];
            
            return c;
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));