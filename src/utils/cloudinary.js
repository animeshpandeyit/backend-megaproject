import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
// const uploadResult = await cloudinary.uploader
//   .upload(
//     "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
//     {
//       public_id: "shoes",
//     }
//   )
//   .catch((error) => {
//     console.log(error);
//   });

// console.log(uploadResult);

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //  file has been successfully uploaded
    console.log("file successfully uploaded on cloudinary");
    console.log(uploadResult.url);

    return uploadResult;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
    // console.error("Error uploading file to cloudinary:", error);
    // return null;
    /* `fs.unlinkSync(localFilePath);` is a synchronous method in Node.js that deletes the file
    specified by `localFilePath`. In the context of the code snippet provided, this line is used to
    delete the local file after it has been successfully uploaded to Cloudinary. This helps in
    cleaning up the local storage after the file has been transferred to the cloud storage to free
    up space and maintain cleanliness. */
  }
};

export { uploadOnCloudinary };
