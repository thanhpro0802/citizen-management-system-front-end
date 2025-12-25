export const webpack = {
  configure: (webpackConfig) => {
    webpackConfig.module.rules.forEach((rule) => {
      if (rule.use) {
        rule.use.forEach((use) => {
          if (use.loader && use.loader.includes("source-map-loader")) {
            use.exclude = /node_modules/;
          }
        });
      }
    });
    return webpackConfig;
  },
};
