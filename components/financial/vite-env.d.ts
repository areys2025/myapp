/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MERCHANT_URL: string;
  readonly VITE_MERCHANT_UID: string;
  readonly VITE_MERCHANT_API_USER_ID: string;
  readonly VITE_MERCHANT_API_KEY: string;
  // add more if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
