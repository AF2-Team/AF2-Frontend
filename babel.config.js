module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        //'@': './',
                        '@assets': './assets',
                        '@fonts': './assets/fonts',
                        '@images': './assets/images',
                        '@components': './components',
                        '@constants': './constants',
                        '@routes': './routes',
                        '@hooks': './hooks',
                        '@utils': './utils',
                    },
                },
            ],
        ],
    };
};
