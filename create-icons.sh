#!/bin/bash
# Create extension icons using ImageMagick or fallback method

ICON_DIR="icons"
SIZES=(16 48 128)
COLOR="#667eea"  # Purple color from design

# Create icons directory
mkdir -p "$ICON_DIR"
echo "📁 Created icons directory"

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "🎨 Using ImageMagick to generate icons..."
    
    for size in "${SIZES[@]}"; do
        # Create a simple colored circle icon
        convert -size "${size}x${size}" \
            -background "$COLOR" \
            -fill white \
            -gravity center \
            label:'🛡' \
            "${ICON_DIR}/icon-${size}.png" 2>/dev/null
        
        if [ -f "${ICON_DIR}/icon-${size}.png" ]; then
            echo "✓ Generated icon-${size}.png"
        else
            echo "✗ Failed to generate icon-${size}.png"
        fi
    done
else
    echo "⚠️  ImageMagick not found. Installing placeholder icons..."
    echo "    To use ImageMagick: brew install imagemagick"
    
    # Create minimal valid PNG files as placeholders
    # These are 1x1 purple pixels (will be displayed by browser at requested size)
    
    # Base64 encoded 1x1 purple PNG
    PNG_DATA="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd3PnAAAADElEQVQI12NYsGABAwADhgGAJjSYkQAAAABJRU5ErkJggg=="
    
    for size in "${SIZES[@]}"; do
        echo "$PNG_DATA" | base64 -D > "${ICON_DIR}/icon-${size}.png"
        echo "✓ Created placeholder icon-${size}.png"
    done
    
    echo ""
    echo "💡 Tip: For better quality icons, install ImageMagick:"
    echo "   brew install imagemagick"
    echo "   Then run: ./create-icons.sh"
fi

echo ""
echo "✅ Icon setup complete!"
echo "   Icons saved to: ./${ICON_DIR}/"