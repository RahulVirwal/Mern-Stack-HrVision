const imageToBase64 = require("image-to-base64");
const path = require("path");
const fs = require("fs").promises;

async function convertImagesToBase64(
  imagePaths,
  defaultImagePath = `${__dirname}/../Assets/no-event.png`
) {
  try {
    return await Promise.all(
      imagePaths.map(async (imgPath) => {
        try {
          // Check if the file exists
          await fs.access(imgPath);

          const imgExt = path.extname(imgPath).slice(1);
          const base64Data = await imageToBase64(imgPath);
          return `data:image/${imgExt};base64,${base64Data}`;
        } catch (error) {
          if (error.code === "ENOENT") {
            // Use the default image
            const defaultBase64Data = await imageToBase64(defaultImagePath);
            return `data:image/jpg;base64,${defaultBase64Data}`;
          } else {
            console.error("Error converting image:", imgPath, error);
            return null; // or handle other errors as needed
          }
        }
      })
    );
  } catch (error) {
    console.error("Error processing images to Base64", error);
    throw error;
  }
}

module.exports = convertImagesToBase64;
