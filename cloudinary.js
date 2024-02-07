require("dotenv").config();

const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.apiKey,
  api_secret: process.env.apiSecret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadFile = async (image) => {
  const res = await cloudinary.uploader.upload(image, opts);
  // console.log(res);
  return res;
};

const deleteFile = async (id) => {
  const result = await cloudinary.uploader.destroy(id);
  console.log(result);
  //   return result;
};

module.exports = { uploadFile, deleteFile };
