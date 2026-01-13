export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // 支持带 emoji 和不带 emoji 两种格式
      headerPattern: /^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})?\s*(\w+)(?:\((.+)\))?:\s(.+)$/u,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'css',
        'refactor',
        'perf',
        'test',
        'ui',
        'chore',
      ],
    ],
    'subject-case': [0], // 允许中文
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};

