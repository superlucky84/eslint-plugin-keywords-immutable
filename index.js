"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const exceptions = context.options[0] || ['window'];

      return {
        "AssignmentExpression": function(node) {
          if (node.left.type === 'ArrayPattern' && catchArrayDestructuring(node.left, exceptions)) {
            context.report(node, "No object mutation is allowed.");
          } else if (node.left.type !== "MemberExpression") {
            return;
          } else if (exceptions.indexOf(node.left.object.name) > -1){
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

function catchArrayDestructuring(target, exceptions) {
  if (target.type === 'ArrayPattern') {
    return target.elements.some(item => catchArrayDestructuring(item, exceptions));
  } else if (target.type !== "MemberExpression") {
    return false;
  } else if (exceptions.indexOf(target.object.name) > -1){
    return true;
  }

  return  false;
}
