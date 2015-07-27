(function( ColorZebra, $, undefined ) {
    ColorZebra.Preview = function(theCanvas) {
        var canvas = theCanvas;
        var hue = 0;
        var PI_BY_FOUR = Math.PI / 4;
        var drawMode = 'piecewiseLinear';
        
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
            
            if (drawMode === 'linear') {
                drawLinear();
            } else if (drawMode === 'quadratic') {
                drawQuadratic();
            } else if (drawMode === 'piecewiseLinear') {
                drawPiecewiseLinear();
            } else {
                alert('Unknown drawMode: ' + drawMode);
            }
        }
        
        this.changeHue = function() {
            hue += 30 + 300 * Math.random();
        }
        
        function drawQuadratic() {
            // The test image consists of a sine wave plus a ramp function
            // The sine wave has a wavelength of 8 pixels (which is why we multiply by 2pi/8 = pi/4)
            // The base sine wave has amplitude 0.05, so that it spans 10% of the value range
            // In each column, the amplitude of the sine wave ranges from 0 at the bottom to 0.05 at the top, increasing quadratically
            // In each row, the ramp goes from <z> on the left to (1 - <z>) on the right, where <z> = 0.05 * ((height - y) / height)^2 is the maximum amplitude of the sine wave in that row
            // This method is slow, because context fillstyle changes are very expensive (much more than any calculations we're doing). For example, drawing random colors took even more time than drawing the test pattern, and Math.random() is quite fast.
            
            var context = canvas.getContext("2d"),
                x, y,
                width = canvas.width,
                height = canvas.height;
                        
            for (x = 0; x < width; x++) {
                var sinVal = Math.sin(x * PI_BY_FOUR);
                var xt = x / width; // x mapped to [0, 1]
                
                for (y = 0; y < height; y++) {
                    var yt = (height - y) / height;
                    var amp = 0.05 * yt * yt;
                    var val = amp * sinVal + getRamp(xt, amp);
                    context.fillStyle = getColor(val);
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
        
        function drawLinear() {
            // This method draws the same image as drawQuadratic, except that the amplitude of the sine wave decreases linearly towards the bottom, instead of quadratically. This enables us to represent each column as a linear gradient, speeding up rendering by a factor of ~50.
            // To leave a significant area of 'pure' ramp, we stop the gradient 5% from the bottom.
            
            var context = canvas.getContext("2d"),
                x,
                width = canvas.width,
                height = canvas.height;
                        
            for (x = 0; x < width; x++) {
                var xt = x / width; // x mapped to [0, 1]
                var topVal = 0.05 * Math.sin(x * PI_BY_FOUR) + getRamp(xt, 0.05);
                
                var my_gradient = context.createLinearGradient(0, 0, 0, height);
                my_gradient.addColorStop(0, getColor(topVal));
                my_gradient.addColorStop(0.95, getColor(xt));
                
                context.fillStyle = my_gradient;
                context.fillRect(x, 0, 1, height);
            }
        }
        
        function drawPiecewiseLinear() {
            // This method draws the same image as drawQuadratic, except that the amplitude of the sine wave approximates the quadratic modulation with a piecewise linear one. This is much more faithful than the pure linear modulation, and still ~25 times faster than the quadratic one for STEPS = 10.
            var STEPS = 10;
            
            var context = canvas.getContext("2d"),
                x,
                width = canvas.width,
                height = canvas.height;
                        
            for (x = 0; x < width; x++) {
                var xt = x / width; // x mapped to [0, 1]
                var sinVal = Math.sin(x * PI_BY_FOUR);
                
                var my_gradient = context.createLinearGradient(0, 0, 0, height);
                
                for (y = STEPS; y > 0; y--) {
                    var yt = y / STEPS;
                    var amp = 0.05 * yt * yt;
                    var val = amp * sinVal + getRamp(xt, amp);
                    my_gradient.addColorStop(1 - yt, getColor(val));
                }
                
                context.fillStyle = my_gradient;
                context.fillRect(x, 0, 1, height);
            }
        }
        
        function getRamp(xt, amp) {
            return amp + (1 - 2 * amp) * xt;
        }
        
        
        
        
        
        
        
        function getColor(value) {
            return "hsl(" + hue + ", 100%, " + (100 * value) + "%)";
        }
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));