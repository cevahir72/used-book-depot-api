'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Neon için connection string kullan (sslmode=require zorunlu)
let sequelize;

if (process.env.DATABASE_URL) {
  // Connection string varsa kullan (Neon pooled/direct URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Ayrı parametrelerden connection string oluştur
  const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
  
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
const bookModel = require('./book')(sequelize);
db.Book = bookModel;

module.exports = db;