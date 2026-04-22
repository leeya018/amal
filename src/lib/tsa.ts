import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PRIVATE_KEY_KEY = 'amal_rsa_private_pkcs8';
const PUBLIC_KEY_KEY = 'amal_rsa_public_spki';

function arrayBufferToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true, // extractable — needed to export to PKCS8/SPKI
    ['sign', 'verify']
  );
}

export async function ensureRSAKeyPair(): Promise<{
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}> {
  const storedPrivate = await SecureStore.getItemAsync(PRIVATE_KEY_KEY);
  const storedPublic = await SecureStore.getItemAsync(PUBLIC_KEY_KEY);

  if (storedPrivate && storedPublic) {
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      base64ToArrayBuffer(storedPrivate),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const publicKey = await crypto.subtle.importKey(
      'spki',
      base64ToArrayBuffer(storedPublic),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    return { privateKey, publicKey };
  }

  // Generate fresh key pair
  const keyPair = await generateRSAKeyPair();

  // Export as PKCS8/SPKI (binary, then base64) — more compact than JWK
  const privateBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const publicBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);

  const privateB64 = arrayBufferToBase64(privateBuffer);
  const publicB64 = arrayBufferToBase64(publicBuffer);

  // PKCS8 for a 2048-bit key ≈ 1.2KB base64 — within SecureStore 2KB limit
  await SecureStore.setItemAsync(PRIVATE_KEY_KEY, privateB64);
  await SecureStore.setItemAsync(PUBLIC_KEY_KEY, publicB64);

  return keyPair;
}

export type TSAResult = {
  sha256Hash: string;
  rsaSignature: string;
  blockHash: string;
};

export async function signRecording(fileBase64: string): Promise<TSAResult> {
  // 1. SHA-256 of the raw file data
  const sha256Hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    fileBase64
  );

  // 2. RSA-PKCS1v15 sign the hash bytes
  const { privateKey } = await ensureRSAKeyPair();
  const hashBytes = new Uint8Array(sha256Hash.length / 2);
  for (let i = 0; i < hashBytes.length; i++) {
    hashBytes[i] = parseInt(sha256Hash.slice(i * 2, i * 2 + 2), 16);
  }
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    hashBytes
  );
  const rsaSignature = arrayBufferToHex(signatureBuffer);

  // 3. Simulated blockchain timestamp: 0x + SHA-256(hash + signature + timestamp)
  const timestamp = Date.now().toString();
  const rawBlock = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    sha256Hash + rsaSignature + timestamp
  );
  const blockHash = '0x' + rawBlock;

  return { sha256Hash, rsaSignature, blockHash };
}
