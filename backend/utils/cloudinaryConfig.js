import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary, uploader, config } from "cloudinary";
export const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: "dbciposvf",
    api_key: "286148557511677",
    api_secret: "9XG03hpZJz35D_KAl4KJWF9TWXM",
  });

  next();
};

export { uploader, cloudinary };
