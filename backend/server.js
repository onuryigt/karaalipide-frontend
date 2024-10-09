const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL veritabanı bağlantısı
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306, // Varsayılan MySQL portu
});

db.connect((err) => {
  if (err) {
    console.log('MySQL bağlantı hatası:', err);
  } else {
    console.log('MySQL bağlı!');
  }
});

// Tüm ürünleri getiren API
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Yeni ürün ekleme API'si
app.post('/products', (req, res) => {
    const { name, price, category, image } = req.body;
  
    // Verilerin eksik olup olmadığını kontrol edelim
    if (!name || !price || !category || !image) {
      console.error('Eksik veri:', req.body);
      return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır!' });
    }
  
    // Veritabanına veri ekleme işlemi
    const query = 'INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)';
    db.query(query, [name, price, category, image], (err, result) => {
      if (err) {
        console.error('Veritabanına ekleme hatası:', err);  // Hata mesajını logla
        return res.status(500).json({ error: 'Ürün veritabanına eklenemedi!' });
      }
      console.log('Ürün başarıyla eklendi:', result);
      res.json({ id: result.insertId, name, price, category, image });
    });
  });

  app.delete('/categories/:category', (req, res) => {
    const { category } = req.params;
  
    const query = 'DELETE FROM categories WHERE name = ?';
    db.query(query, [category], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Kategori silinemedi!' });
      }
      res.json({ message: 'Kategori başarıyla silindi!' });
    });
  });

  app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category, image } = req.body;
  
    const query = 'UPDATE products SET name = ?, price = ?, category = ?, image = ? WHERE id = ?';
    db.query(query, [name, price, category, image, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Ürün güncellenemedi!' });
      }
      res.json({ message: 'Ürün başarıyla güncellendi!' });
    });
  });

  // Kategorileri listeleme API'si
app.get('/categories', (req, res) => {
    const query = 'SELECT * FROM categories'; // Kategoriler tablosundaki tüm verileri seçiyoruz
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Kategoriler alınamadı!' });
      }
      res.json(result);
    });
  });

  // Kategori ekleme API'si
app.post('/categories', (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Kategori adı gereklidir' });
    }
  
    const query = 'INSERT INTO categories (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Kategori eklenemedi!' });
      }
      res.json({ id: result.insertId, name });
    });
  });

// Sunucuyu çalıştır
app.listen(5003, () => {
  console.log('Server running on http://localhost:5003');
});