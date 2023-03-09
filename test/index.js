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
  ],
  invalid: [
    {
      code: "__W.x = 'no exceptions';",
      options: [['window', '__W']],
      errors: [{
        message: "No object mutation is allowed.",
      }],
    },
    {
      code: "window.x = 'no exceptions';",
      options: [['window', '__W']],
      errors: [{
        message: "No object mutation is allowed.",
      }],
    },
    {
      code: "[__W.a, __W.b] = [1, 3];",
      options: [['window', '__W']],
      errors: [{
        message: "No object mutation is allowed.",
      }],
    }
  ],
});
