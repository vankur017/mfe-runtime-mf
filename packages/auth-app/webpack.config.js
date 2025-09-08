const { container } = require("webpack");
const ModuleFederationPlugin = container.ModuleFederationPlugin;
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        "./Login": "./src/remote/Login",
        "./UserProfile": "./src/remote/UserProfile",
        "./manifest": "./src/remote/manifest",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        zustand: { singleton: true },
        "@mfeshared/store": { singleton: true },
      },
    }),
  ],
};
