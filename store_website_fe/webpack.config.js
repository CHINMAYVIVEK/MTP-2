const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'ecommerce-store-app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
  },
  mode: 'development',
  devServer: {
    port: 8504,
    historyApiFallback: true,
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
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: ['react', 'react-dom'],
};
