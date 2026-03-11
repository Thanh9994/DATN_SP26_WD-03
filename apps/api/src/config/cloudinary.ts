import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // console.log("Dữ liệu body nhận được:", req.body);
    const customName = req.body.customName || "image";
    const cleanName = customName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return {
      folder: "cinema_app",
      public_id: `${Date.now()}-${cleanName}`,
      format: "webp",
      transformation: [{ quality: 60 }],
    };
  },
});
const upload = multer({ storage: storage });

export { upload };
export default cloudinary;
