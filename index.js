'use strict';

module.exports = {
  meta: { name: 'eslint-plugin-keywords-immutable', version: '1.3.12' },
  rules: {
    'no-mutation': {
      meta: {
        type: 'problem', // 규칙 유형: problem, suggestion, layout 중 하나
        docs: {
          description: 'Disallow mutations of specified keywords',
          category: 'Best Practices',
          recommended: true,
        },
        schema: [
          {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' }, // 문자열 허용
                { type: 'object', instanceof: 'RegExp' }, // 정규식 허용
              ],
            },
          },
          {
            type: 'boolean', // deep 옵션
          },
        ],
      },
      create(context) {
        const [keywords = ['event'], deep = false] = context.options;

        return {
          AssignmentExpression(node) {
            if (catchAssignmentExpression(node.left, keywords, deep)) {
              context.report({
                node,
                message: 'This is an unacceptable mutation.',
              });
            }
          },
          CallExpression(node) {
            if (catchCallExpression(node, keywords, deep)) {
              context.report({
                node,
                message: 'This is an unacceptable mutation.',
              });
            }
          },
        };
      },
    },
  },
  configs: {
    recommended: {
      rules: {
        'keywords-immutable/no-mutation': [2, ['event']],
      },
    },
  },
};

function catchCallExpression(node, keywords, deep) {
  const objectName = node?.callee?.object?.name;
  const objectMethodName = node?.callee?.property?.name;
  const isAssignMethod =
    objectName === 'Object' && objectMethodName === 'assign';

  if (isAssignMethod) {
    const firstArgument = node.arguments[0];
    if (
      firstArgument.type === 'Identifier' &&
      checkKeyword(firstArgument.name, keywords)
    ) {
      return true;
    } else if (
      firstArgument.type === 'MemberExpression' &&
      catchAssignmentExpression(
        { object: firstArgument, type: 'MemberExpression' },
        keywords,
        deep
      )
    ) {
      return true;
    }
  }
  return false;
}

function catchAssignmentExpression(target, keywords, deep) {
  if (target.type === 'ArrayPattern') {
    return target.elements.some(item =>
      catchAssignmentExpression(item, keywords, deep)
    );
  } else if (target.type === 'ObjectPattern') {
    return target.properties.some(item =>
      catchAssignmentExpression(item.value, keywords, deep)
    );
  } else if (target.type !== 'MemberExpression') {
    return false;
  } else if (
    target.object.property &&
    checkKeyword(target.object.property.name, keywords)
  ) {
    return true;
  } else if (checkKeyword(target.object.name, keywords)) {
    return true;
  } else if (deep && target.object.object) {
    return catchAssignmentExpression(target.object, keywords, deep);
  }

  return false;
}

function checkKeyword(name, keywords) {
  const regexs = keywords.filter(word => word instanceof RegExp);

  if (keywords.includes(name)) {
    return true;
  } else if (regexs.length) {
    return regexs.some(regex => regex.test(name));
  }

  return false;
}
