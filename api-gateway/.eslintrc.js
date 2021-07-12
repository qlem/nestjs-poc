module.exports = {
    extends: ['airbnb-typescript-prettier'],
    parserOptions: {
        // We need to set project to 'null' otherwise the linter won't work on some files
        project: null,
    },
    root: true,
    rules: {
        'import/prefer-default-export': 0,
    }
};
