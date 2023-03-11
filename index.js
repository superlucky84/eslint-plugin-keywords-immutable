"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const keywords = context.options[0] || ['event'];

      return {
        "AssignmentExpression": function(node) {
          if (catchArrayDestructuring(node.left, keywords)) {
            context.report(node, "This is an unacceptable mutation.");
          }

          return;
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
  } else if (target.type === "ObjectPattern") {
    return target.properties.some(item => catchArrayDestructuring(item.value, keywords));
  } else if (target.type !== "MemberExpression") {
    return false;
  } else if (target.object.property && keywords.indexOf(target.object.property.name) > -1){
    return true;
  } else if (keywords.indexOf(target.object.name) > -1){
    return true;
  }

  return  false;
}
