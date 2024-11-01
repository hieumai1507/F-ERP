module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Đảm bảo bạn có preset này
    plugins: [
      'nativewind/babel', // Plugin của NativeWind
      // Bạn có thể thêm các plugin khác nếu cần
    ],
  };
};
