module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-tabs": 0,
        "indent":0,
        "semi": 0,
        "no-const-assign": "warn",
        "no-this-before-super": "warn",
        "no-undef": "error",
        "no-unreachable": "warn",
        "no-unused-vars": "warn",
        "constructor-super": "warn",
        "valid-typeof": "warn",
        "react/prefer-stateless-function":0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-multiple-empty-lines": 0,
        "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }],
        "object-curly-newline": ["warn", {
            "ObjectExpression": "never",
            "ObjectPattern": { "multiline": true },
            "ImportDeclaration": "never",
            "ExportDeclaration": { "multiline": true, "minProperties": 3 }
        }],
        "react/self-closing-comp": ["warn", {
            "component": true,
            "html": true
        }],
        "no-trailing-spaces": 0,
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "ignore",
            "imports": "never",
            "exports": "never",
            "functions": "ignore"
        }],
        "react/react-in-jsx-scope": 0,
        "react/jsx-indent": 0,
        "arrow-body-style": 0,
        "use_spaces": 0,
        "react/destructuring-assignment": 0,
        "react/prop-types": 0,
        "object-curly-spacing": 0,
        "key-spacing": 0,
        "react/jsx-indent-props": 0,
        "global-require": 0,
        "react/jsx-boolean-value": 0,
        "react/jsx-closing-bracket-location": 0,
        "object-curly-newline": 0,
        "react/jsx-curly-brace-presence": 0,
        "react/jsx-equals-spacing": 0,
        "quotes": 0,
        "padded-blocks": 0,
        "react/no-unescaped-entities": 0,
        "arrow-parens": 0,
        "no-unneeded-ternary": 1,
        "react/jsx-closing-tag-location": 1,
        "prefer-const": 1,
        "react/no-unused-state": 1,
        "quote-props": 0,
        "no-mixed-spaces-and-tabs": 0,
        "max-len": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/no-access-state-in-setstate": 0,
        "no-plusplus": 0
    }
};