'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
    dialect: dbConfig.dialect,
    logging: false
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false
  });
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
const bookModel = require('./book')(sequelize);
db.Book = bookModel;

module.exports = db;