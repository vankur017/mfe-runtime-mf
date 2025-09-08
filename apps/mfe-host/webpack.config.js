// apps/mfe-host/webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.tsx",
  mode: isDev ? "development" : "production",
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  output: {
    publicPath: "auto",
    filename: isDev ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@mfeshared/store": path.resolve(__dirname, "../../packages/mfeshared/store/src")
    }
    // ✅ No alias for react/react-dom
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript"
              ],
              plugins: [] // No react-refresh for now
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js", // optional for host
      remotes: {}, // dynamic remotes loaded at runtime
      shared: {
        react: { singleton: true, requiredVersion: false, eager: true },
        "react-dom": { singleton: true, requiredVersion: false, eager: true },
        zustand: { singleton: true, requiredVersion: false, eager: false },
        "@mfeshared/store": { singleton: true, requiredVersion: false, eager: false }
      }
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ForkTsCheckerWebpackPlugin()
  ].filter(Boolean)
};
