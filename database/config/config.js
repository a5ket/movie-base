module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './dev.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: './prod.sqlite',
    logging: false,
  }
}
