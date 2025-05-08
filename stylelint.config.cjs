module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
  ],
  plugins: ['stylelint-order'],
  rules: {
    indentation: 2,
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': null,
  },
}
