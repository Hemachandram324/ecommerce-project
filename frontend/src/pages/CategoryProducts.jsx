import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CategoryProducts = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/category/byname?name=${name}`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    fetchCategoryProducts();
  }, [name]);

  return (
    <div className="container">
      <h2>Products in "{name}"</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;