// Import other necessary modules and types

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      accessToken: string;
      refreshToken: string;
      payload: {
        companyId: number;
        roleId: number;
        userId: number;
        email: string;
        emailVerified: boolean;
        phoneNumberVerified: boolean;
        phoneNumber: string;
        status: string;
        displayName: string;
        tenantId: string;
        isSeller: boolean;
        id: string;
        sub: string;
        iss: string;
        aud: string;
        allowAutoRegsiter: boolean;
        isSmsConfigured: boolean;
        type: string;
        iat: number;
        exp: number;
      };
    } & DefaultSession["user"];
  }
}
