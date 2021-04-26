module.exports = {
    entry: './client/index.js', 
    mode: 'development',
    output: {
      path: __dirname + '/public',
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        { // options for JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        },
        { // options for CSS files
          test: /\.css$/,
          use: [
              'style-loader',
              'css-loader',
          ]
        }
      ]
    }
  }