"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const keywords = context.options[0] || ['event'];
      const deep = context.options[1] || false;

      return {
        "AssignmentExpression": function(node) {
          if (catchArrayDestructuring(node.left, keywords, deep)) {
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

function catchArrayDestructuring(target, keywords, deep) {
  if (target.type === 'ArrayPattern') {
    return target.elements.some(item => catchArrayDestructuring(item, keywords, deep));
  } else if (target.type === "ObjectPattern") {
    return target.properties.some(item => catchArrayDestructuring(item.value, keywords, deep));
  } else if (target.type !== "MemberExpression") {
    return false;
  } else if (target.object.property && checkKeyword(target.object.property.name, keywords)){
    return true;
  } else if (checkKeyword(target.object.name, keywords)){
    return true;
  } else if (deep && target.object.object){
    return catchArrayDestructuring(target.object, keywords, deep);
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
