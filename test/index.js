"use strict";

const { RuleTester } = require("eslint");

const rule = require("../index.js").rules["no-mutation"];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      window: "readonly",
      __W: "readonly",
    },
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
    {
      code: "__W.x.y = 'no exceptions';",
      options: [['window', '__W'], false],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "Object.assign(k.j.w.__W.a.v, { v: 3 });",
      options: [['__W'], false],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
  ],
  invalid: [
    {
      code: "__W.x.y = 'no exceptions';",
      options: [['window', '__W'], true],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
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
    {
      code: "Object.assign(v.a.s.__W, { v: 3 });",
      options: [['__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "Object.assign(k.j.w.__W, { v: 3 });",
      options: [['__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "Object.assign(a.__W.s.a, { v: 3 });",
      options: [['__W'], true],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
    {
      code: "Object.assign(__W, { v: 3 });",
      options: [['__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
  ],
});
