#
# Build all icons needed from a template SVG
# https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
#
# Requires imagemagick and librsvg installed via brew
#

# Optimize SVG
npx svgo --multipass ./_assets/icons/icon.svg

# Convert SVG to PNG
rsvg-convert -o ./_assets/icons/icon.png ./_assets/icons/icon.svg

# Resize PNG to all sizes needed
convert -resize 16x16 ./_assets/icons/icon.png ./_assets/icons/icon-16.png
convert -resize 32x32 ./_assets/icons/icon.png ./_assets/icons/icon-32.png
convert -resize 180x180 ./_assets/icons/icon.png ./_assets/icons/apple-touch-icon.png
convert -resize 192x192 ./_assets/icons/icon.png ./_assets/icons/icon-192.png
convert -resize 512x512 ./_assets/icons/icon.png ./_assets/icons/icon-512.png

# Generate a favicon with two sizes
convert ./_assets/icons/icon-32.png ./_assets/icons/icon-16.png ./_assets/icons/favicon.ico

# Clean up files
rm ./_assets/icons/icon-16.png
rm ./_assets/icons/icon-32.png
rm ./_assets/icons/icon.png