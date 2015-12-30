#!/bin/bash

# Delete the build directory
rm -rf ./build

# Re-create it
mkdir build
cd build

# Copy HTML file
cp ../dev/html/index.html .

# Edit links in the HTML file to reference local files


# Copy CSS file
cp ../dev/css/main.css .

# Copy JS files
cp -r ../dev/js .

# Copy images
mkdir figs
cp -r ../dev/figs ./figs