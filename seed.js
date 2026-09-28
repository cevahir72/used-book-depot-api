'use strict';

const db = require('./models');

const books = [
  { name: 'Sefiller', stock: 5 },
  { name: 'Suç ve Ceza', stock: 3 },
  { name: 'Kürk Mantolu Madonna', stock: 7 },
  { name: '1984', stock: 10 },
  { name: 'Hayvan Çiftliği', stock: 4 },
  { name: 'Küçük Prens', stock: 8 },
  { name: 'Beyaz Diş', stock: 2 },
  { name: 'Martin Eden', stock: 6 }
];

async function seed() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Tablo yeniden oluşturuldu');

    for (const book of books) {
      await db.Book.create(book);
      console.log(`Eklendi: ${book.name} - Stok: ${book.stock}`);
    }

    console.log('Seed tamamlandı!');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
}

seed();