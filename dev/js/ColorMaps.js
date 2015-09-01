(function( ColorZebra, $, undefined ) {
    ColorZebra.colorMaps = {        
        'Grey' : new ColorMap(
            'Grey',
            'Grey scale',
            [ [  0, 0, 0],
              [100, 0, 0] ],
            2
        ),
        
        'WhiteHot' : new ColorMap(
            'WhiteHot',
            'Black-Red-Yellow-White heat colour map',
            [ [  5,  0,  0],
              [ 15, 37, 21],
              [ 25, 49, 37],
              [ 35, 60, 50],
              [ 45, 72, 60],
              [ 55, 80, 70],
              [ 65, 56, 73],
              [ 75, 31, 78],
              [ 85,  9, 84],
              [100,  0,  0] ],
            2
        ),
        
        'Glow' : new ColorMap(
                    'Glow',
                    'Black-Red-Yellow heat colour map',
                    [ [ 5,   0,  0],
                      [15,  37, 21],
                      [25,  49, 37],
                      [35,  60, 50],
                      [45,  72, 60],
                      [55,  80, 70],
                      [65,  56, 73],
                      [75,  31, 78],
                      [85,   9, 84],
                      [98, -16, 93] ],
                    2
                 );
        
        'Garden' : new ColorMap(
                    'Garden',
                    'Colour Map along the green edge of CIELAB space',
                    [ [ 5,  -9,  5],
                      [15, -23, 20],
                      [25, -31, 31],
                      [35, -39, 39],
                      [45, -47, 47],
                      [55, -55, 55],
                      [65, -63, 63],
                      [75, -71, 71],
                      [85, -79, 79],
                      [95, -38, 90] ],
                    2
                 );
        
        'Sky' : new ColorMap(
                    'Sky',
                    'Blue shades running vertically up the blue edge of CIELAB space',
                    [ [ 5,  30,  -52],
                      [15,  49,  -80],
                      [25,  64, -105],
                      [35,  52, -103],
                      [45,  26,  -87],
                      [55,   6,  -72],
                      [65, -12,  -56],
                      [75, -29,  -40],
                      [85, -44,  -24],
                      [95, -31,   -9] ],
                    2
                 );
        
        'Twilight' : new ColorMap(
                    'Twilight',
                    'Blue-Pink-Light Pink colour map',
                    [ [ 5, 30,  -52],
                      [15, 49,  -80],
                      [25, 64, -105],
                      [35, 73, -105],
                      [45, 81,  -88],
                      [55, 90,  -71],
                      [65, 85,  -55],
                      [75, 58,  -38],
                      [85, 34,  -23],
                      [95, 10,   -7] ],
                    2
                 );
        
        'Sunrise' : new ColorMap(
                    'Sunrise',
                    'description',
                    [ [L1, a1, b1],
                      [L2, a2, b2] ],
                    2
                 );
        
        'Grey' : new ColorMap(
                    'name',
                    'description',
                    [ [L1, a1, b1],
                      [L2, a2, b2] ],
                    2
                 );
        
        'Grey' : new ColorMap(
                    'name',
                    'description',
                    [ [L1, a1, b1],
                      [L2, a2, b2] ],
                    2
                 );
        
        'Grey' : new ColorMap(
                    'name',
                    'description',
                    [ [L1, a1, b1],
                      [L2, a2, b2] ],
                    2
                 );
        
        
    }
}( window.ColorZebra = window.ColorZebra || {}, jQuery ));