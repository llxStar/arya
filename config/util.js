const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  resolve: (...args) => path.join(__dirname, '..', ...args),
  baseStyleLoader: [
    process.env.NODE_ENV === 'production'
      ?
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
            hmr: false,
          },
        }
      : 'style-loader',
    'css-loader', 'postcss-loader'
  ],
};
