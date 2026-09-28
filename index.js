const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET /books - tüm kitapları getir
app.get('/books', async (req, res) => {
  try {
    const books = await db.Book.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      count: books.length,
      books: books.map(b => ({
        bookName: b.name,
        stock: b.stock
      }))
    });
  } catch (err) {
    console.error('DB hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST /book - kitap ara (LIKE pattern: %{değişken}%)
app.post('/book', async (req, res) => {
  const { bookName } = req.body;

  if (!bookName || typeof bookName !== 'string') {
    return res.status(400).json({ error: 'bookName zorunludur ve string olmalıdır' });
  }

  try {
    // Kitabı LIKE pattern ile ara (case-insensitive, iLike kullan)
    const books = await db.Book.findAll({
      where: {
        name: {
          [db.Sequelize.Op.iLike]: `%${bookName}%`
        }
      },
      order: [['name', 'ASC']]
    });

    if (!books || books.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    // Bulundu - isim ve stok döndür (birden fazla olabilir)
    res.json({
      count: books.length,
      books: books.map(b => ({
        bookName: b.name,
        stock: b.stock
      }))
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