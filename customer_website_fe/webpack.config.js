const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'ecommerce-customer-app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
  },
  mode: 'development',
  devServer: {
    port: 8503,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: ['react', 'react-dom'],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env': JSON.stringify(process.env),
      'process': JSON.stringify({ env: { NODE_ENV: 'development' } })
    }),
  ],
};
