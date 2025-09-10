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
              plugins: []
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"] // Removed postcss-loader
      }
    ]
  },
  
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        // The host's webpack only needs to know the remote's name and its entry file.
        // The App.tsx file handles dynamic loading of individual components.
        auth: `auth@${isDev ? "http://localhost:3001" : "https://your-deployed-auth-url"}/remoteEntry.js`, 
      },
      shared: {
        react: { singleton: true, requiredVersion: false, eager: true },
        "react-dom": { singleton: true, requiredVersion: false, eager: true },
        zustand: { singleton: true, requiredVersion: false, eager: true },
        "react-router-dom": { singleton: true, requiredVersion: false, eager: true },
        "@mfeshared/store": { singleton: true, requiredVersion: false, eager: true }
      }
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ForkTsCheckerWebpackPlugin()
  ].filter(Boolean)
};
