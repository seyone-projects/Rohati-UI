import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import {
  decryptAES,
  decryptWithKey,
  encryptAES,
  encryptHybrid,
} from "../utils/encryption.js";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:7000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AES_SECRET_KEY =
  process.env.EXPO_PUBLIC_AES_SECRET_KEY || "rohati-secret-key-123";

function isPublicRoute(url = "") {
  return (
    url.includes("/auth/loginnew") ||
    url.includes("/auth/signup") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/registernew") ||
    url.includes("/auth/verify-login-otp") ||
    url.includes("/public")
  );
}

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Track per-request AES key for decrypting responses.
    config.__aesKey = null;

    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      const url = config.url || "";

      // 1) Public/pre-login: AES-only using static secret
      if (url.includes("/auth/loginnew") || url.includes("/auth/registernew")) {
        const { encryptedPayload } = encryptAES(config.data);
        config.data = { encryptedPayload };
      } else if (!isPublicRoute(url) && token) {
        // 2) Authenticated/protected: Hybrid RSA + AES
        const publicKeyPem = await AsyncStorage.getItem("publicKeyPem");
        if (publicKeyPem) {
          const { encryptedPayload, encryptedAesKey, aesKey } =
            await encryptHybrid(config.data, publicKeyPem);
          config.__aesKey = aesKey;
          config.data = { encryptedPayload, encryptedAesKey };
        } else {
          // Fallback: no public key available
          const { encryptedPayload } = encryptAES(config.data);
          config.data = { encryptedPayload };
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Helper to clear storage and redirect
const clearStorageAndRedirect = async () => {
  await AsyncStorage.multiRemove([
    "accessToken",
    "refreshToken",
    "user",
    "publicKeyPem",
    "privateKeyPem",
  ]);
  router.replace("/auth/loginnew");
};

apiClient.interceptors.response.use(
  async (response) => {
    const req = response.config;
    const aesKey = req?.__aesKey;

    if (
      response.data &&
      typeof response.data === "object" &&
      response.data.encryptedPayload
    ) {
      try {
        if (aesKey) {
          response.data = decryptWithKey(
            response.data.encryptedPayload,
            aesKey,
          );
        } else {
          response.data = decryptAES(response.data.encryptedPayload);
        }
      } catch (e) {
        console.error("Decryption error:", e);
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const aesKey = originalRequest?.__aesKey;

    if (
      error.response?.data &&
      typeof error.response.data === "object" &&
      error.response.data.encryptedPayload
    ) {
      try {
        const decrypted = aesKey
          ? decryptWithKey(error.response.data.encryptedPayload, aesKey)
          : decryptAES(error.response.data.encryptedPayload);

        error.response.data = decrypted;
      } catch (e) {
        console.error("Decryption error (error interceptor):", e);
      }
    }

    // Skip error handling for login request
    if (
      originalRequest?.url?.includes("/auth/loginnew") ||
      originalRequest?.url?.includes("/auth/registernew")
    ) {
      return Promise.reject(error);
    }

    const errMsg = error.response?.data?.message || "";
    const isDecryptionError =
      (error.response?.status === 400 &&
        errMsg.includes("encrypted payload")) ||
      errMsg.toLowerCase().includes("decryption") ||
      errMsg.toLowerCase().includes("oaep") ||
      errMsg.toLowerCase().includes("incorrect key");

    if (isDecryptionError) {
      await clearStorageAndRedirect();
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (
        error.response?.data?.code === "TOKEN_EXPIRED" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          if (refreshToken) {
            const refreshResponse = await axios.post(
              `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/refresh`,
              { refreshToken },
            );

            const { accessToken, refreshToken: newRefreshToken } =
              refreshResponse.data.data;
            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          await clearStorageAndRedirect();
          return Promise.reject(refreshError);
        }
      } else {
        await clearStorageAndRedirect();
      }
    }

    if (error.response?.status === 403) {
      // Access denied, redirect to a forbidden screen or login
      router.replace("/auth/loginnew");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
