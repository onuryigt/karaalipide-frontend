import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';  // Stil dosyası

const AdminPanel = ({ setCategories, setProducts }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');  // Varsayılan olarak boş
  const [image, setImage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setLocalCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [products, setLocalProducts] = useState([]);

  // Kategorileri ve ürünleri backend'den çekme
  useEffect(() => {
    axios.get('https://karaalibackend-426b57487d54.herokuapp.com/categories')
      .then(response => {
        setLocalCategories(response.data);
        setCategories(response.data);
      })
      .catch(error => console.error('Kategoriler yüklenemedi:', error));

    axios.get('https://karaalibackend-426b57487d54.herokuapp.com/products')
      .then(response => {
        setLocalProducts(response.data); // Ürünleri state'e atıyoruz
        setProducts(response.data);
      })
      .catch(error => console.error('Ürünler yüklenemedi:', error));
  }, [setCategories, setProducts]);

  // Ürün ekleme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const newProduct = { name, price, category, image };

    axios.post('https://karaalibackend-426b57487d54.herokuapp.com/products', newProduct)
      .then(response => {
        alert('Ürün başarıyla eklendi!');
        setLocalProducts([...products, response.data]); // Yeni ürünü listeye ekliyoruz
      })
      .catch(error => {
        console.error('Ürün eklenemedi:', error);
      });

    setName('');
    setPrice('');
    setCategory('');  // Kategori seçimini sıfırla
    setImage('');
  };

  // Kategori ekleme işlemi
  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!newCategory) {
      alert('Lütfen kategori adını girin!');
      return;
    }

    axios.post('https://karaalibackend-426b57487d54.herokuapp.com/categories', { name: newCategory })
      .then(response => {
        setLocalCategories([...categories, response.data]);
        setNewCategory('');
        alert('Kategori başarıyla eklendi!');
      })
      .catch(error => {
        console.error('Kategori eklenemedi:', error);
      });
  };

  // Kategori silme işlemi
  const handleDeleteCategory = (catName) => {
    axios.delete(`https://karaalibackend-426b57487d54.herokuapp.com/categories/${catName}`)
      .then(response => {
        setLocalCategories(categories.filter(c => c.name !== catName));
        alert('Kategori başarıyla silindi!');
      })
      .catch(error => {
        console.error('Kategori silinemedi:', error);
      });
  };

  // Ürün düzenleme işlemi
  const handleEditProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setEditingProduct(product.id);
  };

  // Ürün güncelleme işlemi
  const handleUpdateProduct = (e) => {
    e.preventDefault();

    const updatedProduct = { name, price, category, image };

    axios.put(`https://karaalibackend-426b57487d54.herokuapp.com/products/${editingProduct}`, updatedProduct)
      .then(response => {
        const updatedProducts = products.map(p =>
          p.id === editingProduct ? { ...p, ...updatedProduct } : p
        );
        setLocalProducts(updatedProducts);
        alert('Ürün başarıyla güncellendi!');
        setEditingProduct(null);
        setName('');
        setPrice('');
        setCategory('');
        setImage('');
      })
      .catch(error => {
        console.error('Ürün güncellenemedi:', error);
      });
  };

  return (
    <div className="admin-panel-container">
      <div className="card">
        <h2>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleSubmit}>
          <label>Ürün Adı:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Fiyat:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Kategori:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="" disabled>Seçiniz</option> {/* Varsayılan boş seçenek */}
            {categories.length > 0 ? categories.map((cat, index) => (
              <option key={index} value={cat.name}>{cat.name}</option>
            )) : <option>Yükleniyor...</option>}
          </select>

          <label>Görsel URL'si:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button type="submit" className="btn">
            {editingProduct ? 'Ürünü Güncelle' : 'Ürün Ekle'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Kategori Ekle</h2>
        <form onSubmit={handleAddCategory}>
          <label>Kategori Adı:</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <button type="submit" className="btn">Kategori Ekle</button>
        </form>
      </div>

      <div className="card">
        <h2>Kategori Sil</h2>
        <ul>
          {categories.length > 0 ? categories.map((cat, index) => (
            <li key={index}>
              {cat.name}
              <button onClick={() => handleDeleteCategory(cat.name)} className="btn-delete">Sil</button>
            </li>
          )) : <p>Kategori bulunamadı.</p>}
        </ul>
      </div>

      <div className="card">
        <h2>Ürünleri Düzenle</h2>
        <ul>
          {products.length > 0 ? products.map((product) => (
            <li key={product.id}>
              {product.name} - {product.price}₺ - {product.category}
              <button onClick={() => handleEditProduct(product)} className="btn-edit">Düzenle</button>
            </li>
          )) : <p>Ürün bulunamadı.</p>}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;