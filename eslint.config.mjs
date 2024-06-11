import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticPluginJs from "@stylistic/eslint-plugin-js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    plugins: {
      "@stylistic/js": stylisticPluginJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "always"],
    },
  },
  { ignores: ["dist/*"] },
];
