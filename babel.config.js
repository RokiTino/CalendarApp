module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@types': './src/types',
          '@utils': './src/utils',
          '@theme': './src/theme',
        },
      },
    ],
  ],
};
