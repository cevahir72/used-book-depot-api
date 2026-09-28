const express = require('express');
const db = require('./models');

const app = express();
const PORT = 3000;

app.use(express.json());

// POST /book - kitap ara
app.post('/book', async (req, res) => {
  const { bookName } = req.body;

  if (!bookName || typeof bookName !== 'string') {
    return res.status(400).json({ error: 'bookName zorunludur ve string olmalıdır' });
  }

  try {
    // Kitabı ara (case-insensitive)
    const book = await db.Book.findOne({
      where: db.sequelize.where(
        db.sequelize.fn('LOWER', db.sequelize.col('name')),
        bookName.toLowerCase()
      )
    });

    if (!book) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    // Bulundu - isim ve stok döndür
    res.json({
      bookName: book.name,
      stock: book.stock
    });
  } catch (err) {
    console.error('DB hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// DB sync ve server başlat
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Veritabanı senkronize edildi');
    app.listen(PORT, () => {
      console.log(`API çalışıyor: http://localhost:${PORT}`);
      console.log(`POST /book - body: { "bookName": "Kitap Adı" }`);
    });
  })
  .catch(err => {
    console.error('DB bağlantı hatası:', err);
  });