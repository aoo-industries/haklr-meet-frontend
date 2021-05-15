const { ChakraLoaderPlugin } = require("chakra-loader");

module.exports = {
  devServer: {
    disableHostCheck: true,
  },

  configureWebpack: {
    plugins: [new ChakraLoaderPlugin()],
  },
};
