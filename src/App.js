import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import QRMenu from './components/QRMenu';
import AdminPanel from './components/AdminPanel';
import CategoryPanel from './components/CategoryPanel';
import SettingsPanel from './components/SettingsPanel';
import AdminLogin from './components/AdminLogin';
import logo from './karaali-logo.png';

function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Karışık Pide',
      price: '50₺',
      category: 'Pide',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Lahmacun',
      price: '30₺',
      category: 'Lahmacun',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Kaşarlı Pide',
      price: '45₺',
      category: 'Pide',
      image: 'https://via.placeholder.com/150'
    }
  ]);

  const [categories, setCategories] = useState(['Pide', 'Lahmacun']);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');

  // Ürün ekleme fonksiyonu
  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  // Kategori ekleme fonksiyonu
  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Arka plan rengini güncelle
  const handleBackgroundChange = (color) => {
    setBackgroundColor(color);
  };

  // Yazı fontunu güncelle
  const handleFontChange = (font) => {
    setFontFamily(font);
  };

  return (
    <Router>
      <div className="App" style={{ backgroundColor, fontFamily }}>
        <header>
          <img src={logo} alt="Karaali Pidecisi" className="logo" />
          <nav>
            <Link to="/"></Link>
            <Link to="/admin"></Link>
          </nav>
        </header>

        <Routes>
          {/* QR Menü Sayfası */}
          <Route
            path="/"
            element={<QRMenu products={products} />}
          />

          {/* Yönetim Paneli */}
          <Route
            path="/admin"
            element={
              <AdminLogin>
                <AdminPanel
                  onAddProduct={addProduct}
                  categories={categories}
                />
                <CategoryPanel
                  onAddCategory={addCategory}
                  categories={categories}
                />
                <SettingsPanel
                  onBackgroundChange={handleBackgroundChange}
                  onFontChange={handleFontChange}
                />
              </AdminLogin>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;