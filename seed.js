'use strict';

const db = require('./models');

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();