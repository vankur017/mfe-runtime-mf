const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    port: 3001,
    static: path.join(__dirname, "dist"),
    hot: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve(__dirname, "src"),                     // auth-app source
          path.resolve(__dirname, "../mfeshared/store/src"),  // mfeshared package
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        "./Login": "./src/remote/Login",
        "./UserProfile": "./src/remote/UserProfile",
        "./manifest": "./src/remote/manifest"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "@mfeshared/store": { singleton: true }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
  ],
  output: {
    publicPath: "auto"
  }
};
