// Shader files are imported as raw strings (see turbopack.rules in next.config.ts)
declare module "*.vert" {
  const source: string;
  export default source;
}
declare module "*.frag" {
  const source: string;
  export default source;
}
declare module "*.glsl" {
  const source: string;
  export default source;
}
