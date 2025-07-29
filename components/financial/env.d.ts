/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MERCHANT_UID: string;
  readonly VITE_MERCHANT_API_USER_ID: string;
  readonly VITE_MERCHANT_API_KEY: string;
  readonly VITE_MERCHANT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
