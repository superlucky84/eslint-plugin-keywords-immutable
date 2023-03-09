"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const keywords = context.options[0] || ['event'];

      return {
        "AssignmentExpression": function(node) {
          if (node.left.type === 'ArrayPattern' && catchArrayDestructuring(node.left, keywords)) {
            context.report(node, "No object mutation is allowed.");
          } else if (node.left.type !== "MemberExpression") {
            return;
          } else if (node.left.object.property && keywords.indexOf(node.left.object.property.name) > -1){
            context.report(node, "No object mutation is allowed.");
          } else if (node.left.object.name && keywords.indexOf(node.left.object.name) > -1){
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
        "keywords-immutable/no-mutation": [2, ['event']]
      }
    }
  }    
};

function catchArrayDestructuring(target, keywords) {
  if (target.type === 'ArrayPattern') {
    return target.elements.some(item => catchArrayDestructuring(item, keywords));
  } else if (target.type !== "MemberExpression") {
    return false;
  } else if (target.object.property && keywords.indexOf(target.object.property.name) > -1){
    return true;
  } else if (keywords.indexOf(target.object.name) > -1){
    return true;
  }

  return  false;
}
