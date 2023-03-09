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
      // code: "__W.v = [1, 3];",
      options: [['window', '__W']],
      errors: [{
        message: "This is an unacceptable mutation.",
      }],
    },
  ],
});
