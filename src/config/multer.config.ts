import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import status from "http-status";
import { cloudinaryUpload } from "./cloudinary.config.js";
import AppError from "../app/errors/app-error.js";
import crypto from "crypto";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    try {
      if (!file) {
        throw new AppError(
          "File is required to upload to Cloudinary",
          status.BAD_REQUEST,
        );
      }

      const originalFileName = file.originalname;
      const extension = originalFileName.split(".").pop()?.toLocaleLowerCase();
      const fileNameWithoutExtension = originalFileName
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9-]/gi, "");

      const safeName = fileNameWithoutExtension || "file";
      const uniqueFileName = crypto.randomUUID() + "-" + safeName;

      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const pdfExtensions = ["pdf"];
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
      let folderName = "";

      if (!extension || !allowedExtensions.includes(extension)) {
        throw new AppError("Unsupported file type", status.BAD_REQUEST);
      }

      if (imageExtensions.includes(extension as string)) {
        folderName = "images";
      } else if (pdfExtensions.includes(extension as string)) {
        folderName = "pdfs";
      }

      return {
        resource_type: "auto",
        public_id: uniqueFileName,
        folder: `ph-healthcare/${folderName}`,
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        error.message || "Failed to upload file to Cloudinary",
        status.INTERNAL_SERVER_ERROR,
      );
    }
  },
});

export const multerUpload = multer({ storage });
