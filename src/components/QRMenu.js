import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QRMenu.css';

const QRMenu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Seçilen kategori

  useEffect(() => {
    // Ürünleri çek
    axios.get('https://karaalibackend-426b57487d54.herokuapp.com/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Ürünler çekilemedi:', error);
      });

    // Kategorileri çek
    axios.get('https://karaalibackend-426b57487d54.herokuapp.com/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Kategoriler çekilemedi:', error);
      });
  }, []);

  // Seçilen kategoriye göre ürünleri filtreleme
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : [];

  return (
    <div className="qr-menu">
      <div className="category-list">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`category-item ${selectedCategory === cat.name ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(cat.name)} // Kategori seçme
          >
            {cat.name}
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="product-list">
          <h2>{selectedCategory}</h2>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div className="qr-menu-item" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <h3>{product.price}₺</h3> {/* Fiyat TL cinsinden */}
              </div>
            ))
          ) : (
            <p>Bu kategoride ürün bulunmamaktadır.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QRMenu;