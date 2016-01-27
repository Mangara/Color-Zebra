#!/bin/bash

# Delete the build directory
rm -rf ./build

# Re-create it
mkdir build
cd build

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
  sed -i "$LINE"'i<script src="all.js"></script>' index.html
  # Delete all <script src="\.\./js/[a-zA-Z]*\.js"></script> imports (from the ../js/ directory)
  sed -i '/<script src="\.\.\/js\/[a-zA-Z]*\.js"><\/script>/d' index.html

# Copy CSS file
cp ../dev/css/main.css .

# Merge JS files into one big file
cat ../dev/js/* > all.js

# Copy images
mkdir figs
cp -r ../dev/figs ./figs