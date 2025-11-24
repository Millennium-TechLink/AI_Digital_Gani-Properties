/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string;
  readonly VITE_FORM_METHOD?: string;
  readonly VITE_FORM_ACCESS_KEY?: string;
  readonly VITE_FORM_PROVIDER?: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
