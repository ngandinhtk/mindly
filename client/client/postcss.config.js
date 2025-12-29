module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true
      }
    },
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  },
};
