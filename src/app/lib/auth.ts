import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../../config/env";
import { UserRole, UserStatus } from "@prisma/client";
import ms, { StringValue } from "ms";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
  redirectURLs: {
    signIn: `${env.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },
  session: {
    expiresIn: Math.floor(
      ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
    ),
    updateAge: Math.floor(
      ms(env.BETTER_AUTH_SESSION_UPDATE_AGE as StringValue) / 1000,
    ),
    cookieCache: {
      enabled: true,
      maxAge: Math.floor(
        ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
      ),
    },
  },
  advanced: {
    disableCSRFCheck: true,
    cookiePrefix: "better-auth",
    useSecureCookies: env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    cookies: {
      state: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.MEMBER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      date_of_birth: {
        type: "date",
        required: false,
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
      },
    },
  },
});
