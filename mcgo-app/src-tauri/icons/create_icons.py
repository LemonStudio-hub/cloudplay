#!/usr/bin/env python3
"""Create simple icons for MCGO.Online Tauri app"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with M letter"""
    # Create image with green background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle background
    margin = size // 10
    radius = size // 5
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(34, 197, 94)  # Primary green color
    )

    # Draw M letter
    try:
        # Try to use a system font
        font_size = size // 2
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Get text bounding box
    text = "M"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Center text
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]

    # Draw text
    draw.text((x, y), text, fill='white', font=font)

    # Save
    img.save(filename, format='PNG')
    print(f"Created {filename}")

def create_ico(sizes, filename):
    """Create ICO file with multiple sizes"""
    images = []
    for size in sizes:
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Draw rounded rectangle background
        margin = size // 10
        radius = size // 5
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=radius,
            fill=(34, 197, 94)  # Primary green color
        )

        # Draw M letter
        try:
            font_size = size // 2
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()

        text = "M"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (size - text_width) // 2
        y = (size - text_height) // 2 - bbox[1]

        draw.text((x, y), text, fill='white', font=font)
        images.append(img)

    # Save as ICO
    images[0].save(filename, format='ICO', sizes=[(img.size[0], img.size[1]) for img in images], append_images=images[1:])
    print(f"Created {filename}")

if __name__ == '__main__':
    icons_dir = os.path.dirname(os.path.abspath(__file__))

    # Create PNG icons
    create_icon(32, os.path.join(icons_dir, '32x32.png'))
    create_icon(128, os.path.join(icons_dir, '128x128.png'))
    create_icon(256, os.path.join(icons_dir, '128x128@2x.png'))

    # Create ICO file
    create_ico([16, 32, 48, 64, 128, 256], os.path.join(icons_dir, 'icon.ico'))

    # Create ICNS placeholder (just copy the 256px PNG for now)
    import shutil
    src = os.path.join(icons_dir, '128x128@2x.png')
    dst = os.path.join(icons_dir, 'icon.icns')
    shutil.copy2(src, dst)
    print(f"Created {dst} (placeholder)")
