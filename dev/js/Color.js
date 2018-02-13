(function( ColorZebra, $, undefined ) {
    ColorZebra.Color = function() {}
    
    ColorZebra.Color.desaturateLAB = function(cielab) {
        return [cielab[0], cielab[1] / 3, cielab[2] / 3];
    }
    
    ColorZebra.Color.LABtoXYZ = function(cielab) {
        // Convert to CIEXYZ. Formulas and numbers from Wikipedia:
        // https://en.wikipedia.org/wiki/Lab_color_space
        // Using conversion constants corresponding to illuminant D65
        var fY = 0.00862068965 * (cielab[0] + 16);
        var X = 0.95047 * f_inverse(fY + 0.002 * cielab[1]);
        var Y =           f_inverse(fY);
        var Z = 1.08883 * f_inverse(fY - 0.005 * cielab[2]);

        return [X, Y, Z];
        
        function f_inverse(t) {
            if (t > 0.20689655172) {
                return Math.pow(t, 3);
            } else {
                return 0.12841854934 * (t - 0.13793103448);
            }
        }
    }
    
    ColorZebra.Color.LABtoRGB = function(cielab) {
        // Convert to CIEXYZ
        var xyz = ColorZebra.Color.LABtoXYZ(cielab);
        
        // Convert to RGB. Formulas and numbers from Wikipedia:
        // https://en.wikipedia.org/wiki/SRGB#The_forward_transformation_.28CIE_xyY_or_CIE_XYZ_to_sRGB.29
        var R = correctGamma( 3.2406 * xyz[0] - 1.5372 * xyz[1] - 0.4986 * xyz[2]);
        var G = correctGamma(-0.9689 * xyz[0] + 1.8758 * xyz[1] + 0.0415 * xyz[2]);
        var B = correctGamma( 0.0557 * xyz[0] - 0.2040 * xyz[1] + 1.0570 * xyz[2]);
        
        // Clamp out-of-gamut colors
        R = Math.max(0, Math.min(1, R));
        G = Math.max(0, Math.min(1, G));
        B = Math.max(0, Math.min(1, B));
        
        return [R, G, B];
        
        function correctGamma(t) {
            if (t <= 0.0031308) {
                return 12.92 * t;
            } else {
                return 1.055 * Math.pow(t, 0.41666666666) - 0.055;
            }
        }
    }
    
    ColorZebra.Color.LABtoIntegerRGB = function(cielab) {
        var rgb = ColorZebra.Color.LABtoRGB(cielab);
        return [Math.round(255 * rgb[0]), Math.round(255 * rgb[1]), Math.round(255 * rgb[2])];
    }
    
    ColorZebra.Color.LABtoCSS = function(cielab) {
        var rgb = ColorZebra.Color.LABtoIntegerRGB(cielab);
        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    }
    
    ColorZebra.Color.LCHtoLAB = function(lch) {
        var theta = Math.PI * lch[2] / 180;
        return [lch[0], lch[1] * Math.cos(theta), lch[1] * Math.sin(theta)]
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));