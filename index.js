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
  } else if (target.object.property && checkKeyword(target.object.property.name, keywords)){
    return true;
  } else if (checkKeyword(target.object.name, keywords)){
    return true;
  }

  return  false;
}

function checkKeyword(name, keywords) {
  const regexs = keywords.filter(word => word instanceof RegExp);

  if (keywords.indexOf(name) > -1) {
    return true;
  } else if (regexs.length) {
    return regexs.some(regex => regex.test(name));
  }

  return false;
}
