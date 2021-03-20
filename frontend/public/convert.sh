#!/bin/bash

set -euo pipefail

#
# Convert banner images
#
# https://github.com/mahadana/pujas.live/tree/09fefcd7fb08e1fffb09b3cdb4f7b8e9328cf2a2/frontend/public
#

rm -rf banner
mkdir banner
for f in cropped*.jpg; do
  convert "$f" -resize 4000x400 banner/banner${f#cropped};
done
jpegoptim --strip-all --all-progressive --size=40k banner/*.jpg
