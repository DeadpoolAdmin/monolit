import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import TerserPlugin from "terser-webpack-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ env, command, envMode }) => {
  const isProduction = command === "build";
  const envFile = envMode === "prod" ? ".env.prod" : ".env.dev";

  console.log(`Using ${envFile} environment configuration for ${command} mode`);

  return {
    plugins: [
      pluginReact(),
      pluginSass({
        sassLoaderOptions: {
          sassOptions: {
            includePaths: [path.resolve(__dirname, "app")],
          },
        },
      }),
    ],

  source: {
    entry: {
        bundle: "./app/index.tsx", // Changed from 'index' to 'bundle' to match output filename
      },
      define: {
        // Load environment variables
        "process.env": JSON.stringify(
          Object.fromEntries(
            Object.entries(process.env).filter(([key]) =>
              key.startsWith("REACT_APP_") || 
              key.startsWith("NODE_ENV") ||
              key.startsWith("PUBLIC_URL")
            )
          )
        ),
      },
    },

    output: {
    distPath: {
      root: "build",
      js: ".",
      css: ".",
      html: ".",
    },
      filename: {
        js: "bundle.js", // Always use bundle.js for consistent access
        css: "index.css",
        html: "index.html", // Force HTML filename to index.html
      },
      sourceMap: {
        js: isProduction ? false : "source-map",
        css: isProduction ? false : true,
      },
      assetPrefix: "auto",
      cleanDistPath: true,
      filenameHash: false,
      injectStyles: true, // ✅ Inject CSS into JS bundle (like style-loader in webpack)
      // Copy public assets
      copy: [
        {
          from: "app/public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    },

    html: {
      template: "./app/public/index.html",
    },

    performance: {
      chunkSplit: {
        strategy: "all-in-one", // Single bundle file (like webpack config)
    },
  },

  resolve: {
    alias: {
        "@": path.resolve(__dirname, "app"),
        "@shared": path.resolve(__dirname, "app/shared"),
        "@assets": path.resolve(__dirname, "app/assets"),
        "@router": path.resolve(__dirname, "app/Router"),
        "@modules": path.resolve(__dirname, "app/modules"),
        "@layout": path.resolve(__dirname, "app/layout"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 8000,
      open: false, // Don't automatically open browser
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "*",
      },
    },

    tools: {
      // Configure Babel for FULL IE11/ES5 compatibility
      babel(config, { addIncludes }) {
        // Include ALL JavaScript files, including node_modules
        addIncludes([
          /\.(?:ts|tsx|js|jsx|mjs|cjs)$/,
          /node_modules/
        ]);
        
        config.presets = [
          [
            "@babel/preset-env",
            {
              targets: {
                chrome: "28",
                ie: "11",
              },
              useBuiltIns: "usage",
              corejs: {
                version: "3",
                proposals: true
              },
              modules: false,
              forceAllTransforms: true, // Force ALL ES6+ transforms to ES5
              bugfixes: false, // Disable optimizations that may skip transforms
            },
          ],
          ["@babel/preset-react", {
            runtime: "classic"
          }],
          "@babel/preset-typescript",
        ];
        
        config.plugins = [
          "@babel/plugin-syntax-dynamic-import",
          // Transform async/await and generators to ES5
          [
            "@babel/plugin-transform-runtime",
            {
              corejs: 3,
              helpers: true,
              regenerator: true,
              version: "^7.24.0"
            }
          ],
          // Ensure regenerator is properly transformed
          "@babel/plugin-transform-regenerator",
          // Transform arrow functions
          "@babel/plugin-transform-arrow-functions",
          // Transform async to generators
          "@babel/plugin-transform-async-to-generator",
        ];
        
        return config;
      },

      // Handle SCSS path aliases
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, "app")],
        },
      },

      rspack: (config) => {
        // Force ES5 output with explicit settings
        config.target = ["web", "es5"];
        
        // Completely disable SWC transformations - let Babel handle everything
        config.experiments = config.experiments || {};
        config.experiments.rspackFuture = config.experiments.rspackFuture || {};
        config.experiments.rspackFuture.disableTransformByDefault = true;
        
        // Ensure ALL modules go through Babel transformation
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        
        // Find and modify all JS/TS rules to remove exclusions
        config.module.rules.forEach(rule => {
          if (rule.test && (rule.test.toString().includes('jsx') || rule.test.toString().includes('tsx'))) {
            delete rule.exclude;
            rule.include = undefined;
          }
        });
        
        // ✅ CONFIGURE ASSETS TO BE EMITTED AS FILES (for Android compatibility)
        // Remove any existing asset rules and add resource-only rules
        config.module.rules = config.module.rules.filter(rule => {
          // Remove default asset rules
          if (rule.test && rule.type && rule.type.includes('asset')) {
            return false;
          }
          return true;
        });
        
        // Emit ALL images as separate files (not base64)
        config.module.rules.push({
          test: /\.(png|webp|jpg|jpeg|svg|gif|ico)$/i,
          type: 'asset/resource', // Emit as separate files
          generator: {
            filename: 'static/image/[name][ext]', // Flat structure in static/image/
          }
        });
        
        // Emit ALL audio/video as separate files
        config.module.rules.push({
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
          type: 'asset/resource', // Emit as separate files
          generator: {
            filename: 'static/media/[name][ext]', // Flat structure in static/media/
          }
        });
        
        // Emit ALL fonts as separate files
        config.module.rules.push({
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource', // Emit as separate files
          generator: {
            filename: 'static/fonts/[name][ext]', // Flat structure in static/fonts/
          }
        });

        // Disable all code splitting to create single bundle
        config.optimization = config.optimization || {};
        config.optimization.splitChunks = false;
        config.optimization.runtimeChunk = false;
        
        // Configure Terser for ES5 output
        if (isProduction) {
          config.optimization.minimizer = [
            new TerserPlugin({
              terserOptions: {
                parse: {
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  comparisons: false,
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  ecma: 5,
                  comments: false,
                  ascii_only: true,
                },
              },
            }),
          ];
        }

        // Configure output for strict ES5
        config.output = config.output || {};
        config.output.filename = isProduction ? "bundle.js" : "[name].js";
        config.output.chunkFilename = "[name].[id].js";
        config.output.environment = {
          // Strict ES5 - disable ALL modern features
          arrowFunction: false,
          bigIntLiteral: false,
          const: false,
          destructuring: false,
          dynamicImport: false,
          forOf: false,
          module: false,
          optionalChaining: false,
          templateLiteral: false,
        };
        
        // Force legacy chunk loading
        config.output.chunkLoading = 'jsonp';
        config.output.chunkFormat = 'array-push';

        return config;
      },
    },

    // Use browserslist from package.json for target browsers
  };
});
