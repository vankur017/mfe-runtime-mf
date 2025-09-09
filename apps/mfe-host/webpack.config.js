// apps/auth-app/webpack.config.js
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
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@mfeshared/store": path.resolve(__dirname, "../../packages/mfeshared/store/src"),
    },
  },
  devServer: {
    port: 3001, // Auth app will run on port 3001
    historyApiFallback: true,
    hot: true,
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
                "@babel/preset-typescript",
              ],
              plugins: [],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "auth", // The name of this micro-frontend
      filename: "remoteEntry.js",
      exposes: {
        // Expose the components and manifest for the host to consume
        "./Login": "./src/components/Login.tsx",
        "./UserProfile": "./src/components/UserProfile.tsx",
        "./manifest": "./src/remote/manifest.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: false, eager: true },
        "react-dom": { singleton: true, requiredVersion: false, eager: true },
        zustand: { singleton: true, requiredVersion: false, eager: true },
        "react-router-dom": { singleton: true, requiredVersion: false, eager: true },
        "@mfeshared/store": { singleton: true, requiredVersion: false, eager: true },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
};