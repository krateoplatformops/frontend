interface ImportMetaEnv {
  readonly VITE_CONFIG_NAME?: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css'
