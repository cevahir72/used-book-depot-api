'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION;

// Neon için connection string kullan (sslmode=require zorunlu)
let sequelize;

const sequelizeOptions = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  // Serverless optimizasyonu: connection pool
  pool: {
    max: isServerless ? 1 : 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: isServerless ? 1000 : 60000
  }
};

if (process.env.DATABASE_URL) {
  // Connection string varsa kullan (Neon pooled/direct URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);
} else {
  // Ayrı parametrelerden connection string oluştur
  const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
  
  sequelize = new Sequelize(connectionString, sequelizeOptions);
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
const bookModel = require('./book')(sequelize);
db.Book = bookModel;

module.exports = db;