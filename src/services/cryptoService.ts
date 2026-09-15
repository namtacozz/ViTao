/**
 * ViTao Crypto Service
 * Uses Web Crypto API (SubtleCrypto) for zero-dependency client-side AES-GCM-256 encryption.
 */

// Helper to convert Uint8Array to base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Hash password for quick PIN matching
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':vitao-salt-secret');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer);
}

// Derive AES-GCM key from password and salt
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt arbitrary object or string with master password
 * Output format: JSON string containing base64 encoded salt, iv, and ciphertext
 */
export async function encryptData(data: unknown, password: string): Promise<string> {
  const enc = new TextEncoder();
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const encodedText = enc.encode(text);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedText
  );

  const payload = {
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(cipherBuffer)
  };

  return JSON.stringify(payload);
}

/**
 * Decrypt payload with master password
 */
export async function decryptData<T = unknown>(encryptedPayloadStr: string, password: string): Promise<T | null> {
  try {
    const payload = JSON.parse(encryptedPayloadStr);
    if (!payload.salt || !payload.iv || !payload.ciphertext) {
      return null;
    }

    const salt = base64ToBuffer(payload.salt);
    const iv = base64ToBuffer(payload.iv);
    const ciphertext = base64ToBuffer(payload.ciphertext);

    const key = await deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      ciphertext as BufferSource
    );

    const dec = new TextDecoder();
    const plainText = dec.decode(decryptedBuffer);

    try {
      return JSON.parse(plainText) as T;
    } catch {
      return plainText as unknown as T;
    }
  } catch (error) {
    console.error('Decryption failed. Incorrect password or corrupted data.', error);
    return null;
  }
}
