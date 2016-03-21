/* Returns a CSS color string for any value between 0 and 1 (inclusive).
   Perceptive brightness increases monotonically from 0 to 1. */
function getColor_<<name>>(value) {
    if (value < 0 || value > 1) {
        return null;
    }

    var L = <<points[0][0]>> + value * <<(points[points.length - 1][0] - points[0][0])>>, A, B;

    if (L == <<points[points.length - 1][0]>>) {
        A = <<points[points.length - 1][1]>>;
        B = <<points[points.length - 1][2]>>;
    } else {
        var points = <<points>>;
        var start = 0, end = <<points.length - 1>>;
            
        while (end - start > 1) {
            var middle = Math.floor(start + (end - start) / 2);
            var midVal = points[middle][0];
            
            if (midVal <= L) {
                start = middle;
            } else {
                end = middle;
            }
        }
        
        var fraction = (L - points[start][0]) / (points[end][0] - points[start][0]);
        A = points[start][1] + fraction * (points[end][1] - points[start][1]);
        B = points[start][2] + fraction * (points[end][2] - points[start][2]);
    }

    var fY = 0.00862068965 * (L + 16);
    var X = 0.95047 * f_inverse(fY + 0.002 * A);
    var Y =           f_inverse(fY);
    var Z = 1.08883 * f_inverse(fY - 0.005 * B);

    var R = Math.max(0, Math.min(1, correctGamma( 3.2406 * X - 1.5372 * Y - 0.4986 * Z)));
    var G = Math.max(0, Math.min(1, correctGamma(-0.9689 * X + 1.8758 * Y + 0.0415 * Z)));
    var B = Math.max(0, Math.min(1, correctGamma( 0.0557 * X - 0.2040 * Y + 1.0570 * Z)));

    return "rgb(" + Math.round(255 * R) + "," + Math.round(255 * G) + "," + Math.round(255 * B) + ")";

    function f_inverse(t) {
        if (t > 0.20689655172) {
            return Math.pow(t, 3);
        } else {
            return 0.12841854934 * (t - 0.13793103448);
        }
    }

    function correctGamma(t) {
        if (t <= 0.0031308) {
            return 12.92 * t;
        } else {
            return 1.055 * Math.pow(t, 0.41666666666) - 0.055;
        }
    }
}

