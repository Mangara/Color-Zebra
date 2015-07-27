(function( ColorZebra, $, undefined ) {
    ColorZebra.Color = function(cielab) {
        var lightness = cielab[0];
        var a = cielab[1];
        var b = cielab[2];
        
        // Conversion constants (illuminant D65)
        var Xn = 0.95047;
        var Yn = 1;
        var Zn = 1.08883;
        
        this.toRGB = function() {
            // The first set of formulas and numbers is from Wikipedia:
            // https://en.wikipedia.org/wiki/Lab_color_space
            // The second set is from 
            // http://www.cs.rit.edu/~ncs/color/t_convert.html
            
            // Convert to CIEXYZ
            var X = Xn * f_inverse( 0.00862068965 * (lightness + 16) + 0.002 * a);
            var Y = Yn * f_inverse( 0.00862068965 * (lightness + 16));
            var Z = Zn * f_inverse( 0.00862068965 * (lightness + 16) - 0.005 * b);
            
            // Convert to RGB
            var R = Math.round(255 * ( 3.240479 * X - 1.537150 * Y - 0.498535 * Z));
            var G = Math.round(255 * (-0.969256 * X + 1.875992 * Y + 0.041556 * Z));
            var B = Math.round(255 * ( 0.055648 * X - 0.204043 * Y + 1.057311 * Z));
            
            // INCORRECT! Navy blue (0, 0, 128) is CIELAB (12.973, 47.505, -64.705) according to www.colorhexa.com, but converts to (0, -0, 55).
            
            return [R, G, B];
        }
        
        function f_inverse(t) {
            if (t > 0.20689655172) {
                return Math.pow(t, 3);
            } else {
                0.12841854934 * (t - 0.13793103448);
            }
        }
    }
    
    /* ColorZebra.Color.fromRGB = function(rgb) {
        // Maybe necessary?
    } */
    
    ColorZebra.Color.LABtoRGB = function(cielab) {
        var c = new ColorZebra.Color(cielab);
        return c.toRGB();
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));