import { createAuthClient } from '@better-auth/client/expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize the Better Auth Expo Client
export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7000',
    storage: AsyncStorage, // Automatically stores and hydrates session tokens
});

/**
 * Login user using Better Auth Email and Password
 * @param {Object} credentials - { email, password }
 * @returns {Promise}
 */
export const login = async (credentials) => {
    const { email, password } = credentials;
    const response = await authClient.signIn.email({
        email,
        password,
    });
    return response.data;
};

/**
 * Sign up user using Better Auth Email and Password
 * @param {Object} data - { email, password, name }
 * @returns {Promise}
 */
export const signUp = async (data) => {
    const { email, password, name } = data;
    const response = await authClient.signUp.email({
        email,
        password,
        name,
    });
    return response.data;
};

/**
 * Logout user session
 * @returns {Promise}
 */
export const logout = async () => {
    const response = await authClient.signOut();
    return response;
};

/**
 * Get current user profile from session
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
    const session = await authClient.getSession();
    return session.data?.user || null;
};

/**
 * Refresh access token
 * @returns {Promise}
 */
export const refreshToken = async () => {
    // Better Auth handles token refreshing internally on the client
    const session = await authClient.getSession();
    return session.data;
};
