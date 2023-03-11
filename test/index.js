"use strict";

var RuleTester = require("eslint").RuleTester;

var rule = require("../index.js").rules['no-mutation'];
var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});


ruleTester.run("no-mutation", rule, {
  valid: [
    {
      code: "module.exports = fn;",
      options: [['window', '__W']]
    },
    {
      code: "obj.k = 1;",
      options: [['window', '__W']]
    },
    {
      code: "[a.k, a.j] = [1, 3];",
      options: [['window', '__W']]
    },
    {
      code: "[a.b.c.k, a.j] = [1, 3];",
      options: [['window', '__W']]
    },
    {
      code: "[[a.k, a.j], a.k] = [[1, 3], 3];",
      options: [['window', '__W']]
    },
    {
      code: "({ a: { b: obj.s } } = { a: { b: 3 } });",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "STATIC_X.x = 'no exceptions';",
      options: [[/^(final|FINAL)/]],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "({ a: { b: STATIC.s } } = { a: { b: 3 } });",
      options: [[/^(final|FINAL)/]],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
  ],
  invalid: [
    {
      code: "__W.x = 'no exceptions';",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "window.x = 'no exceptions';",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "[[__W.a, __W.b]] = [[1, 3], 3];",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "[__W.a, __W.b] = [1, 3];",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "[k.j.w.__W.a, __W.b] = [1, 3];",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "a.b.c.d.__W.v = [1, 3];",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "({ a: __W.s } = { a: 3 });",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "({ a: k.__W.s } = { a: 3 });",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "({ a: { b: __W.s } } = { a: { b: 3 } });",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "FINAL_STATIC_X.x = 'no exceptions';",
      options: [[/^(final|FINAL)/]],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "({ a: { b: FINAL.s } } = { a: { b: 3 } });",
      options: [[/^(final|FINAL)/]],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
  ],
});
