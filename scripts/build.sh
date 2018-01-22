#!/bin/bash

# Delete the build directory
rm -rf ./build

# Re-create it
mkdir build
cd build

# Clone gh-pages branch
git clone https://github.com/Mangara/Color-Zebra.git .
git checkout gh-pages

# Empty it
rm *.html
rm *.css
rm *.js
rm -rf ./figs

# Copy HTML file
cp ../dev/html/index.html .

# Edit links in the HTML file to reference local files
 # ../css/main.css -> main.css
 sed -i 's|\.\./css/main\.css|main.css|g' index.html
 # ../figs/download174.svg -> figs/download174.svg
 sed -i 's|\.\./figs|figs|g' index.html
 # All "<script src="../js/*.js"></script> lines should be replaced by a single one
  # Find the first line containing a script import
  LINE=$(
    grep -nm1 '<script src="\.\./js/[a-zA-Z0-9]*\.js"></script>' index.html |
    sed 's|\([0-9][0-9]*\):.*|\1|'
  )
  # Insert <script src="all.js"></script> before this line
  sed -i "$LINE"'i<script src="all.js" async></script>' index.html
  # Delete all <script src="\.\./js/[a-zA-Z]*\.js"></script> imports (from the ../js/ directory)
  sed -i '/<script src="\.\.\/js\/[a-zA-Z]*\.js"><\/script>/d' index.html

# Copy CSS file
cp ../dev/css/main.css .

# Merge JS files into one big file
cat ../dev/js/Color.js ../dev/js/LinearSpline.js ../dev/js/QuadraticSpline.js ../dev/js/ColorMap.js ../dev/js/ColorMaps.js ../dev/js/Exporter.js ../dev/js/CMapDrawer.js ../dev/js/Preview.js ../dev/js/FixedNumPreview.js ../dev/js/main.js > all.js
 # Delete superfluous function close / open pairs
 sed -i '/}( window.ColorZebra = window.ColorZebra || {}, jQuery ));(function( ColorZebra, $, undefined ) {/d' all.js

# Copy images
cp -r ../dev/figs .

# Minify everything
cp ../tools/miniweb.properties .
java -jar ../tools/MiniWeb-v1.0.jar index.html --replace
rm miniweb.properties

# Commit changes
git add .
git commit -m "Update."
git push