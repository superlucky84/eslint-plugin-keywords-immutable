# eslint-plugin-keywords-immutable
Immutable objects with promised keywords do not allow mutation.

## Getting started

#### Installation
`npm i --save-dev eslint-plugin-keywords-immutable`

#### Usage
Add the following to your `.eslintrc`

Can customize keywords, including regular expressions.

```
  plugins: [
    "keywords-immutable"
  ],
  rules: {
    "keywords-immutable/no-mutation": [2, ['window', 'event', 'global', /^FINAL_/]]
  }
```

By default, "event" are disallowed to be mutated.
When used without options, the default option is ['event'].
```
  plugins: [
    "keywords-immutable"
  ],
  rules: {
    "keywords-immutable/no-mutation": 2
  }
```



## Example

#### invalid

* Not allowed because it is part of a keyword.

```js
// "keywords-immutable/no-mutation": [2, ['point', /^FINAL/]]
FINAL_POINT.x = 3;
point.x = 3;
pointParent.point.x = 3;
[point.x, point.y] = [1, 3];
({ a: point.s } = { a: 3 });
```

#### valid
* Allowed because it is not part of a keyword.

```js
// "keywords-immutable/no-mutation": [2, ['point', /^FINAL/]]
FINE_POINT.x = 3;
obj.a = 3;
objParent.obj.x = 3;
[obj.x, obj.b] = [1, 3];
({ a: obj.s } = { a: 3 });
```

## Contributing
Please submit a PR.
