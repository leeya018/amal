#!/bin/bash
# Download Rubik fonts from Google Fonts
# Run: bash scripts/download-fonts.sh

FONTS_DIR="assets/fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading Rubik fonts..."

# Rubik Regular (weight 400)
curl -sL "https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4iFU0U1Z4Y.ttf" \
  -o "$FONTS_DIR/Rubik-Regular.ttf" && echo "✅ Rubik-Regular.ttf"

# Rubik Medium (weight 500)
curl -sL "https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-NYiFU0U1Z4Y.ttf" \
  -o "$FONTS_DIR/Rubik-Medium.ttf" && echo "✅ Rubik-Medium.ttf"

# Rubik Bold (weight 700)
curl -sL "https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-4YuFU0U1Z4Y.ttf" \
  -o "$FONTS_DIR/Rubik-Bold.ttf" && echo "✅ Rubik-Bold.ttf"

# Rubik Light (weight 300)
curl -sL "https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4iFUkU1Z4Y.ttf" \
  -o "$FONTS_DIR/Rubik-Light.ttf" && echo "✅ Rubik-Light.ttf"

echo ""
echo "Done! Fonts saved to $FONTS_DIR/"
