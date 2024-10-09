import React, { useState } from 'react';

const CategoryPanel = ({ onAddCategory, categories }) => {
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCategory(category);
    setCategory(''); // Formu temizle
  };

  return (
    <div className="category-panel">
    </div>
  );
};

export default CategoryPanel;