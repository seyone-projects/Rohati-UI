import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const AES_SECRET_KEY = process.env.EXPO_PUBLIC_AES_SECRET_KEY || 'rohati-secret-key-123';

function ensureKey() {
  if (!AES_SECRET_KEY) throw new Error('AES secret key is not configured');
}

/**
 * AES-only encryption for public/pre-login.
 * @param {any} data
 * @returns {{ encryptedPayload: string }}
 */
export function encryptAES(data) {
  ensureKey();
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.SHA256(AES_SECRET_KEY);

  const encrypted = CryptoJS.AES.encrypt(jsonString, key, { iv });
  const encryptedPayload = `${iv.toString(CryptoJS.enc.Base64)}:${encrypted.toString()}`;

  return { encryptedPayload };
}

/**
 * AES-only decryption.
 * @param {string} encryptedPayload
 * @returns {any}
 */
export function decryptAES(encryptedPayload) {
  ensureKey();
  const [ivB64, encryptedB64] = encryptedPayload.split(':');

  const iv = CryptoJS.enc.Base64.parse(ivB64);
  const key = CryptoJS.SHA256(AES_SECRET_KEY);

  const decrypted = CryptoJS.AES.decrypt(encryptedB64, key, { iv });
  const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}

/**
 * Hybrid encryption (RSA encrypt AES key, AES encrypt JSON payload).
 * Uses jsencrypt for React Native instead of window.crypto.subtle
 * @param {any} data
 * @param {string} publicKeyPem
 * @returns {Promise<{ encryptedPayload: string, encryptedAesKey: string, aesKey: string }>} 
 */
export async function encryptHybrid(data, publicKeyPem) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

  // AES key: base64-encoded random 32 bytes (256-bit)
  const aesKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);

  // AES encrypt payload
  const iv = CryptoJS.lib.WordArray.random(16);
  const aesKeyWordArray = CryptoJS.enc.Base64.parse(aesKey);
  const encrypted = CryptoJS.AES.encrypt(jsonString, aesKeyWordArray, { iv });
  const encryptedPayload = `${iv.toString(CryptoJS.enc.Base64)}:${encrypted.toString()}`;

  // RSA encrypt aesKey
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKeyPem);
  const encryptedAesKey = encryptor.encrypt(aesKey);

  if (!encryptedAesKey) {
    throw new Error('RSA encryption failed');
  }

  return { encryptedPayload, encryptedAesKey, aesKey };
}

/**
 * Decrypt hybrid response payload using AES key.
 * @param {string} encryptedPayload
 * @param {string} aesKey base64
 * @returns {any}
 */
export function decryptWithKey(encryptedPayload, aesKey) {
  const [ivB64, encryptedB64] = encryptedPayload.split(':');

  const iv = CryptoJS.enc.Base64.parse(ivB64);
  const aesKeyWordArray = CryptoJS.enc.Base64.parse(aesKey);

  const decrypted = CryptoJS.AES.decrypt(encryptedB64, aesKeyWordArray, { iv });
  const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}
