"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const exceptions = context.options[0] || ['window'];

      return {
        "AssignmentExpression": function(node) {
          if (node.left.type !== "MemberExpression") {
            return;
          } else if (exceptions.indexOf(node.left.object.name) > -1){
            context.report(node, "No object mutation is allowed.");
          } else if (node.left.object.type === "ThisExpression" && exceptions.indexOf("this") > -1) {
            context.report(node, "No object mutation is allowed.");
          }
          return ;
        }
      };
    }   
  },
  configs: {
    recommended: {
      rules: {
        "keywords-immutable/no-mutation": [2, ['window']]
      }
    }
  }    
};
