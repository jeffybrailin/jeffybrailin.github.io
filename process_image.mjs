import { removeBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';

let image_path = "C:\\Users\\Jeffy\\.gemini\\antigravity\\brain\\ca380e16-2293-4041-a475-fdd47f76cd6e\\media__1773292805651.jpg";
let output_path = "C:\\Users\\Jeffy\\OneDrive\\Desktop\\portfolio\\about-profile.png";

async function processImage() {
  console.log("Removing background...");
  try {
    const blob = await removeBackground(image_path);
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    console.log("Cropping image...");
    await sharp(buffer)
      .trim({ threshold: 0 }) 
      .toFile(output_path);

    console.log("Success! Image processed and saved to", output_path);
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processImage();
