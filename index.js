"use strict";

module.exports = {
  rules: {
    "no-mutation": function(context) {
      const keywords = context.options[0] || ['event'];
      const deep = context.options[1] || false;

      return {
        "AssignmentExpression": function(node) {
          if (catchAssignmentExpression(node.left, keywords, deep)) {
            context.report(node, "This is an unacceptable mutation.");
          }

          return;
        },
        "CallExpression": function(node) {
          if (catchCallExression(node, keywords, deep)) {
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

function catchCallExression(node, keywords, deep) {
  const objectName = node?.callee?.object?.name;
  const objectMethodName = node?.callee?.property?.name;
  const isAssignMehotd = objectName === 'Object' && objectMethodName === 'assign';

  if (isAssignMehotd) {
    const firstArgument = node.arguments[0];

    if (firstArgument.name && checkKeyword(firstArgument.name, keywords)) {
      return true;
    } else if (firstArgument.property && checkKeyword(firstArgument.property.name, keywords)) {
      return true;
    } else if (deep && firstArgument.object){
      return catchAssignmentExpression(firstArgument, keywords, deep);
    }

    return false;
  }
}

function catchAssignmentExpression(target, keywords, deep) {
  if (target.type === 'ArrayPattern') {
    return target.elements.some(item => catchAssignmentExpression(item, keywords, deep));
  } else if (target.type === "ObjectPattern") {
    return target.properties.some(item => catchAssignmentExpression(item.value, keywords, deep));
  } else if (target.type !== "MemberExpression") {
    return false;
  } else if (target.object.property && checkKeyword(target.object.property.name, keywords)){
    return true;
  } else if (checkKeyword(target.object.name, keywords)){
    return true;
  } else if (deep && target.object.object){
    return catchAssignmentExpression(target.object, keywords, deep);
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
