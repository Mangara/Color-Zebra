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
        var colorsPruned = findLongestIncreasingSubsequence(colors);

        // Binary search for the spline with the smallest number of control points that has reasonable error
        var errorCache = [];
        var colormapChache = [];

        var minCP = 2, maxCP = 10;
        var errorBound = 0.001;

        while (maxCP > minCP + 1) {
            var cp = Math.floor((minCP + maxCP) / 2);
            var error = getErrorWithCPs(colorsPruned, cp);

            if (error <= errorBound) {
                maxCP = cp;
            } else {
                minCP = cp;
            }
        }

        // The answer is either minCP or maxCP (= minCP + 1)
        if (getErrorWithCPs(colorsPruned, minCP) <= errorBound) {
            return getColorMapWithCPs(colorsPruned, minCP);
        } else {
            return getColorMapWithCPs(colorsPruned, minCP + 1);
        }

        function getErrorWithCPs(colors, cp) {
            if (!errorCache[cp]) {
                errorCache[cp] = calculateError(colors, getColorMapWithCPs(colors, cp));
            }

            return errorCache[cp];
        }

        function getColorMapWithCPs(colors, cp) {
            if (!colormapChache[cp]) {
                colormapChache[cp] = findBestMap(colors, cp);
            }

            return colormapChache[cp];
        }
    }

    function findLongestIncreasingSubsequence(colors) {
        // predecessor[i] = index of element before colors[i] in the longest increasing subsequence ending with colors[i]
        var predecessor = [];
        // minEnd[i] = index of minimum final value of an increasing sequence of length i
        var minEnd = []

        for (var i = 0; i < colors.length; i++) {
            var val = colors[i][0]; // lightness
            // Binary search in minEnd
            var min = 0, max = (minEnd.length == 0 ? 1 : minEnd.length);

            while (min < max - 1) {
                var mid = min + Math.floor((max - min) / 2);
                var midVal = colors[minEnd[mid]][0];

                if (val == midVal) {
                    min = mid;
                    max = mid;
                } else if (val < midVal) {
                    max = mid;
                } else {
                    min = mid;
                }
            }

            minEnd[max] = i;
            predecessor[i] = (max > 1 ? minEnd[max - 1] : null);
        }

        // Follow predecessors back from minEnd[minEnd.length - 1]
        var x = minEnd[minEnd.length - 1];
        var result = [];

        while (x != null) {
            result.unshift(colors[x]);
            x = predecessor[x];
        }

        return result;
    }

    function calculateError(colors, colormap) {
        // TODO
        return 0;
    }

    function findBestMap(colors, cp) {
        // TODO
        return ColorZebra.colorMap;
    }    
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));