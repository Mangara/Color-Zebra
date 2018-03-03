(function( ColorZebra, $, undefined ) {
    ColorZebra.Preview = function(theCanvas) {
        var canvas = theCanvas;
        
        this.maximize = function() {
            var parent = $(canvas).parent();

            if (canvas.width != parent.width() || canvas.height != parent.height() - 4) {
                canvas.width = parent.width();
                canvas.height = parent.height() - 4; // No clue why the -4 is necessary.
                computeValues();
            }
        }
        
        this.draw = function() {
            if (canvas === undefined) {
                alert('Canvas undefined');
                return;
            }
            
            //drawPiecewiseLinear();
            drawQuadratic();
        }

        var STEPS = 10;
        var values, stops;

        function computeValues() {
            var x, y, width = canvas.width;

            values = [];
            stops = [];

            var amp = [];
            for (y = STEPS; y > 0; y--) {
                var yt = y / STEPS;
                amp[y] = 0.05 * yt * yt;

                stops[y] = 1 - y / STEPS;
            }

            var sinVal = [];
            for (x = 0; x < 8; x++) {
                sinVal.push(Math.sin(x * Math.PI / 4));
            }
                        
            for (x = 0; x < width; x++) {
                var xt = x / (width - 1);
                values[x] = [];

                for (y = STEPS; y > 0; y--) {
                    values[x][y] = amp[y] * sinVal[x % 8] + getRamp(xt, amp[y]);
                }
            }
        }

        function drawPiecewiseLinear() {
            // The test image consists of a sine wave plus a ramp function
            // The sine wave has a wavelength of 8 pixels (which is why we multiply by 2pi/8 = pi/4)
            // The base sine wave has amplitude 0.05, so that it spans 10% of the value range
            // In each column, the amplitude of the sine wave ranges from 0 at the bottom to 0.05 at the top, increasing quadratically
            // In each row, the ramp goes from <z> on the left to (1 - <z>) on the right, where <z> = 0.05 * ((height - y) / height)^2 is the maximum amplitude of the sine wave in that row
            // Drawing it per-pixel is slow, because context fillstyle changes are very expensive (much more than any calculations we're doing).
            // This method draws the same image, except that the amplitude of the sine wave approximates the quadratic modulation with a piecewise linear one.
            // For STEPS = 10 this is nearly impossible to distinguish visually.
            var context = canvas.getContext("2d"),
                x, y,
                width = canvas.width,
                height = canvas.height;
                        
            for (x = 0; x < width; x++) {
                var my_gradient = context.createLinearGradient(0, 0, 0, height);
                
                for (y = STEPS; y > 0; y--) {
                    my_gradient.addColorStop(stops[y], ColorZebra.colorMap.getCSSColor(values[x][y]));
                }
                
                context.fillStyle = my_gradient;
                context.fillRect(x, 0, 1, height);
            }
        }

        function drawQuadratic() {
            // Slightly slower way of drawing the test image pixel-perfect
            var context = canvas.getContext("2d"),
                x, y,
                width = canvas.width,
                height = canvas.height;

            var imageData = context.createImageData(width, height);

            var amp = [];
            for (y = 0; y < height; y++) {
                var yt = (height - y) / (height - 1);
                amp.push(0.05 * yt * yt);
            }

            var sinVal = [];
            for (x = 0; x < 8; x++) {
                sinVal.push(Math.sin(x * Math.PI / 4));
            }

            for (x = 0; x < width; x++) {
                var xt = x / (width - 1); // x mapped to [0, 1]
                
                for (y = 0; y < height; y++) {
                    var val = amp[y] * sinVal[x % 8] + getRamp(xt, amp[y]);

                    if (val > 1) {
                        console.log('x: ' + x + ' y: ' + y + ' sinVal: ' + sinVal[x % 8] + ' amp: ' + amp[y] + ' ramp: ' + getRamp(xt, amp[y]) + ' val: ' + val);
                    }

                    var rgb = ColorZebra.Color.LABtoIntegerRGB(ColorZebra.colorMap.getLABColor(val));

                    var pixel = (y * width + x) * 4;
                    imageData.data[pixel    ] = rgb[0];
                    imageData.data[pixel + 1] = rgb[1];
                    imageData.data[pixel + 2] = rgb[2];
                    imageData.data[pixel + 3] = 255; // opaque
                }
            }

            context.putImageData(imageData, 0, 0);
        }
        
        function getRamp(xt, amp) {
            return amp + (1 - 2 * amp) * xt;
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));