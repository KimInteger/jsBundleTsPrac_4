const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

class customPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('customPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'customPlugin',
        (data, cb) => {
          data.headTags = data.headTags.filter(
            (tag) => tag.tagName !== 'script',
          );
          data.bodyTags = data.bodyTags.filter(
            (tag) => tag.tagName !== 'script',
          );

          const scriptTag = {
            tagName: 'script',
            voidTag: false,
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: compilation.assets['bundle.js'].source(),
          };

          data.bodyTags.push(scriptTag);

          delete compilation.assets['bundle.js'];

          cb(null, data);
        },
      );
    });
  }
}

module.exports = {
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  modules: {
    rulse: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '.src/index.html',
    }),
    new customPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserWebpackPlugin()],
  },
};