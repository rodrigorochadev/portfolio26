import type { NextConfig } from "next";

// Import GLSL shaders as plain strings
const rawShader = {
  loaders: ["./loaders/raw-string-loader.cjs"],
  as: "*.js",
};

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.vert": rawShader,
      "*.frag": rawShader,
      "*.glsl": rawShader,
    },
  },
};

export default nextConfig;
