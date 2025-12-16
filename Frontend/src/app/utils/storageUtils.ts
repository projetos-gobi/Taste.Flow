import { StateStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

const SECRET_KEY = "taste_flow_secure_key_2025";

export const customEncryptedStorage: StateStorage = {
  getItem: (name) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (e) {
      console.error("Erro ao descriptografar Zustand session:", e);
      return null;
    }
  },
  setItem: (name, value) => {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export function decodeToken<T = any>(token: string | null): T | null {
  if (!token) return null;

  try {
    return jwtDecode<T>(token);
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

export function mustChangePassword(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<any>(token);

    return decoded.mustchangepassword === "True" || decoded.mustchangepassword === true;
  } catch (e) {
    console.error("Erro ao verificar mustChangePassword:", e);
    return false;
  }
}
