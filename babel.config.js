module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
        '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
}
