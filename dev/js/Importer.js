(function( ColorZebra, $, undefined ) {
    function getColors() {
        var colors = [], i;
        
        for (i = 0; i < ColorZebra.numColors; i++) {
            colors.push(ColorZebra.colorMap.getLABColor(i / (ColorZebra.numColors - 1)));
        }
        
        return colors;
    }
    
    // colors is a list of LAB colors, possibly non-monotonic
    // We return a ColorZebra.ColorMap that matches the given sequence of colors as closely as possible,
    // while having uniformly monotonically increasing lightness and using few control points
    ColorZebra.importColorMap = function(colors) {
        // Find longest increasing subsequence wrt lightness
        // Have a method that, given the points and a number of control points, finds the best quadratic spline to approximate these points
        // Binary search for the spline with the smallest number of control points that has reasonable error
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));