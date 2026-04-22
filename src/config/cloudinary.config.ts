import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import status from "http-status";
import { env } from "./env.js";
import AppError from "../app/errors/app-error.js";
import crypto from "crypto";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  try {
    if (!buffer || !fileName) {
      throw new AppError(
        "File Name and Buffer are required to upload file to Cloudinary",
        status.BAD_REQUEST,
      );
    }

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const pdfExtensions = ["pdf"];
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];

    const extension = fileName.split(".").pop()?.toLocaleLowerCase();
    let folderName = "";

    if (!extension || !allowedExtensions.includes(extension)) {
      throw new AppError("Unsupported file type", status.BAD_REQUEST);
    }

    if (imageExtensions.includes(extension as string)) {
      folderName = "images";
    } else if (pdfExtensions.includes(extension as string)) {
      folderName = "pdfs";
    }

    const fileNameWithoutExtension = fileName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLocaleLowerCase()
      .replace(/[^a-z0-9-]/gi, "");

    const safeName = fileNameWithoutExtension || "file";
    const uniqueFileName = crypto.randomUUID() + "-" + safeName;

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: uniqueFileName,
            folder: `eco-spark-hub/${folderName}`,
          },
          (error, result) => {
            if (error) {
              return reject(
                new AppError(
                  error.message || "Failed to upload file",
                  status.INTERNAL_SERVER_ERROR,
                ),
              );
            }

            resolve(result as UploadApiResponse);
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      error.message || "Failed to upload file to Cloudinary",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const deleteFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);

    if (!match || !match[1]) {
      throw new AppError("Invalid Cloudinary URL", status.BAD_REQUEST);
      return;
    }

    const publicId = match[1];

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    console.log(`File ${publicId} deleted from Cloudinary`);
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      error.message || "Failed to delete file from Cloudinary",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export { cloudinary as cloudinaryUpload };
