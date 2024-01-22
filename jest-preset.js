module.exports = {
    rootDir: '.',
    roots: ['<rootDir>/src/'],
    transform: {
        '.(ts|tsx)': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(mongoose)/)'],
}
