module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // новая функциональность
        'fix', // исправление бага
        'docs', // изменения в документации
        'style', // форматирование, отсутствующие точки с запятой и т.д.; никаких изменений кода
        'refactor', // рефакторинг кода продакшена
        'test', // добавление тестов
        'chore', // обновление задач сборки, конфигураций менеджера пакетов и т.д.; никаких изменений кода продакшена
        'perf', // изменения кода, улучшающие производительность
        'ci', // изменения в CI
        'build', // изменения, влияющие на систему сборки или внешние зависимости
        'revert', // откат предыдущего коммита
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 500],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 500],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 500],
  },
};
