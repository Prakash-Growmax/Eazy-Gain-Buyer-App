"use client";
import { useRef } from "react";
import { axiosAuth } from "../axios";
import { useSession } from "next-auth/react";
import refreshAuthLogic, {
  checkAccessTokenWillExpireInDay,
} from "../refresh-auth-logic";

const useAxiosAuth = () => {
  const { data: session, update, status } = useSession();
  const isRefreshing = useRef(false);
  axiosAuth.interceptors.request.use(
    async (config) => {
      if (!isRefreshing.current && status === "authenticated") {
        isRefreshing.current = true;
        try {
          const token = await refreshAuthLogic(
            session?.user?.accessToken,
            session?.user?.refreshToken
          );

          if (session?.user && token) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            if (token.renewed) {
              await update(session);
            }
            config.headers["Authorization"] = `Bearer ${token.accessToken}`;
          }
        } catch (error) {
          console.error("Token refresh error:", error);
        } finally {
          isRefreshing.current = false;
        }
        return config;
      } else {
        config.headers[
          "Authorization"
        ] = `Bearer ${session?.user?.accessToken}`;
        return config;
      }
    },
    (error) => Promise.reject(error)
  );

  return axiosAuth;
};

export default useAxiosAuth;
