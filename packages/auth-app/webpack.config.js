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
        test: /\.tsx?$/,
        exclude: /node_modules/,
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
      {
      test: /\.css$/,  
      use: ["style-loader", "css-loader"]
     }
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
        react: { singleton: true, requiredVersion: false, eager: true },
        "react-dom": { singleton: true, requiredVersion: false, eager: true },
        zustand: { singleton: true, requiredVersion: false, eager: true },
        "react-router-dom": { singleton: true, requiredVersion: false, eager: true },
        "@mfeshared/store": { singleton: true, requiredVersion: false, eager: true }
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
