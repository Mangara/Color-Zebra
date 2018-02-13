jQuery = 0; // No jQuery required for this, but must be defined
require('../Color');

test('desaturate', () => {
    expect(ColorZebra.Color.desaturateLAB([0, 0, 0])).toEqual([0, 0, 0]);
    expect(ColorZebra.Color.desaturateLAB([3, 3, 3])).toEqual([3, 1, 1]);
});

test('LABtoXYZ', () => {
    // First 10 RGB values randomly generated from random.org, then added all (0, 255)-combinations
    // CIELAB and XYZ color values from colorhexa.com
    var cielab = [ [59.653, 37.295, -58.801],  [43.843, 50.226, -75.636],  [37.15, 37.831, -75.353],    [72.702, -68.674, 51.87],    [65.978, 7.656, -52.21],     [11.76, 26.804, -20.84],    [34.274, 67.411, -86.313], [53.807, 79.294, -27.645],   [82.057, -66.64, 65.042],    [53.738, 70.077, 48.852],    [0, 0, 0],    [100, -0, -0.009],     [53.239, 80.09, 67.201],     [87.735, -86.183, 83.18],    [32.299, 79.191, -107.865],  [97.139, -21.558, 94.477], [60.324, 98.235, -60.835],   [91.114, -48.083, -14.139] ];
    var xyz    = [ [0.36487, 0.2774, 0.92234], [0.22254, 0.1373, 0.77817], [0.14461, 0.09619, 0.63378], [0.234647, 0.44712, 0.1405], [0.35776, 0.35296, 0.98688], [0.02389, 0.0137, 0.04413], [0.17437, 0.0814, 0.7046], [0.41784, 0.21793, 0.44123], [0.34312, 0.60403, 0.15319], [0.38726, 0.21729, 0.04951], [-0, -0, -0], [0.95047, 1, 1.08897], [0.41242, 0.21266, 0.01933], [0.35758, 0.71516, 0.11919], [0.18046, 0.07219, 0.95044], [0.77, 0.92781, 0.13853],  [0.59289, 0.28484, 0.96978], [0.53804, 0.78734, 1.06964] ];

    for (var i = 0, max = cielab.length; i < max; i++) {
        var expected = xyz[i].map(x => myRound(x));
        var result = ColorZebra.Color.LABtoXYZ(cielab[i]).map(x => myRound(x));
        expect(result).toEqual(expected);
    }
});

test('LABtoRGB', () => {
    // First 10 RGB values randomly generated from random.org, then added all (0, 255)-combinations
    // CIELAB and XYZ color values from colorhexa.com
    var cielab = [ [59.653, 37.295, -58.801], [43.843, 50.226, -75.636], [37.15, 37.831, -75.353], [72.702, -68.674, 51.87], [65.978, 7.656, -52.21], [11.76, 26.804, -20.84], [34.274, 67.411, -86.313], [53.807, 79.294, -27.645], [82.057, -66.64, 65.042], [53.738, 70.077, 48.852], [0, 0, 0], [100, -0, -0.009], [53.239, 80.09, 67.201], [87.735, -86.183, 83.18], [32.299, 79.191, -107.865], [97.139, -21.558, 94.477], [60.324, 98.235, -60.835], [91.114, -48.083, -14.139] ];
    var rgb    = [ [148, 125, 248], [98, 77, 232], [15, 73, 212], [10, 206, 75], [99, 161, 254], [52, 14, 60], [84, 30, 223], [231, 41, 178], [92, 232, 68], [243, 52, 48], [0, 0, 0], [255, 255, 255], [255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255] ];

    for (var i = 0, max = cielab.length; i < max; i++) {
        expect(ColorZebra.Color.LABtoIntegerRGB(cielab[i])).toEqual(rgb[i]);
    }
});

test('LCHtoLAB', () => {
    var lch = [ [30, 89, -59], [90, 89, 96] ];
    var lab = [ [30, 45.8384, -76.2879], [90, -9.3030, 88.5124] ];

    for (var i = 0, max = lch.length; i < max; i++) {
        var expected = lab[i].map(x => myRound(x));
        var result = ColorZebra.Color.LCHtoLAB(lch[i]).map(x => myRound(x));
        expect(result).toEqual(expected);
    }
});

function myRound(t) {
    return Math.sign(t) * Math.abs(Math.round(10000 * t)/10000);
}
