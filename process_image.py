import sys
import io

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Please install rembg and pillow: pip install rembg pillow")
    sys.exit(1)

input_path = r'C:\Users\Jeffy\.gemini\antigravity\brain\ca380e16-2293-4041-a475-fdd47f76cd6e\media__1773292805651.jpg'
output_path = r'C:\Users\Jeffy\OneDrive\Desktop\portfolio\about-profile.png'

print("Processing image...")
with open(input_path, 'rb') as i:
    input_data = i.read()

print("Removing background...")
output_data = remove(input_data)
img = Image.open(io.BytesIO(output_data))

print("Cropping image...")
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

print("Saving image...")
img.save(output_path, "PNG")
print("Saved to", output_path)
