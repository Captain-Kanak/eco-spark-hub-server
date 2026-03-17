import status from "http-status";
import AppError from "../errors/app-error";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { UserRole } from "@prisma/client";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Admin",
      email: "admin@gmail.com",
      password: "password123",
    };

    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isAdminExist) {
      throw new AppError("Admin already exist", status.BAD_REQUEST);
    }

    const admin = await auth.api.signUpEmail({
      body: adminData,
    });

    if (admin.user) {
      await prisma.user.update({
        where: {
          id: admin.user.id,
        },
        data: {
          emailVerified: true,
          role: UserRole.ADMIN,
        },
      });

      console.log("Admin seeded successfully");
    } else {
      throw new AppError("Failed to seed admin", status.INTERNAL_SERVER_ERROR);
    }
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to seed admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

seedAdmin();
