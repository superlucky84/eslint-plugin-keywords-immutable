# eslint-plugin-keywords-immutable
Immutable objects with promised keywords do not allow mutation.

## Getting started

#### Installation
`npm i --save-dev eslint-plugin-keywords-immutable`

#### Usage
Add the following to your `.eslintrc`

By default, "event" are disallowed to be mutated.
```
  plugins: [
    "mutation"
  ],
  rules: {
    "keywords-immutable/no-mutation": 2
  }
```

This can be customized.
```
  plugins: [
    "keywords-immutable"
  ],
  rules: {
    "keywords-immutable/no-mutation": [2, ['window', 'event', 'global']]
  }
```

## Contributing
Please submit a PR.
