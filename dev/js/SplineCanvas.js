(function( ColorZebra, $, undefined ) {
    ColorZebra.SplineCanvas = function(theCanvas) {
        var canvas = theCanvas;
        
        this.maximize = function() {
            var parent = $(canvas).parent();
            canvas.width = parent.width();
            canvas.height = parent.height();
        }
        
        this.draw = function() {
            if (canvas === undefined) {
                alert('Canvas undefined');
                return;
            }
            
            var context = canvas.getContext("2d"),
                t;
            
            // Draw the control points
            context.strokeStyle = "#0F0";
            for (var i = 0, max = points.length; i < max; i++) {
                context.beginPath();
                context.arc(points[i][0], points[i][1], 2, 0, Math.PI * 2, false);
                context.stroke();
            }
            
            context.beginPath();
            for (t = 0; t < 1; t += 0.05) {
                context.lineTo.apply(context, getSplineCoords(t));
            }
            context.strokeStyle = "#000";
            context.stroke();
        }
        
        var points = [ [20, 20], [50, 100], [60, 40], [100, 10], [110, 50], [150, 100] ];
        var knots = [0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1];
        
        function getSplineCoords(t) {
            //console.log('Evaluating t = ' + t);
            var sum = [0, 0];
            
            for (var i = 0, max = points.length; i < max; i++) {
                var b = basis(i, 3, t);
                sum[0] += points[i][0] * b;
                sum[1] += points[i][1] * b;
                //console.log('  Basis ' + i + ' = ' + b + '. Resulting contribution: (' + (points[i][0] * b) + ', ' +  (points[i][1] * b) + ').');
            }
            
            //console.log('Result: ' + sum);
            
            return sum;
        }
        
        function basis(i, k, t) {
            var result;
            
            if (k === 1) {
                if (knots[i] <= t && t < knots[i + 1]) {
                    result = 1;
                } else {
                    result = 0;
                }
            } else {
                result = 0;
                
                if (knots[i + k - 1] != knots[i]) {
                    result += ((t - knots[i]) / (knots[i + k - 1] - knots[i])) * basis(i, k - 1, t);
                }
                if (knots[i + k] != knots[i + 1]) {
                    result += ((knots[i + k] - t) / (knots[i + k] - knots[i + 1])) * basis(i + 1, k - 1, t);
                }
            }
            
            //console.log('    Basis(' + i + ', ' + k + ', ' + t + ') = ' + result);
            return result;
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));