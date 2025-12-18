// Shims locais para o ambiente do Cursor (quando node_modules/@types ainda não estão instalados aqui).
// Em produção (Vercel), os @types são instalados via package.json.

declare const process: {
  env: Record<string, string | undefined>;
};

declare module "js-cookie" {
  const Cookies: any;
  export default Cookies;
}


