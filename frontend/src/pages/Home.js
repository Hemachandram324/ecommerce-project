import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategorySlider from '../components/CategorySlider';
import CategoryStrip from '../components/CategoryStrip';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const productSectionRef = useRef(null); // ref to scroll

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/getCategory');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async (category = '') => {
    try {
      const res = category
        ? await api.get(`/v1/products/category/byname?name=${encodeURIComponent(category)}`)
        : await api.get('/v1/products/getproducts');
      const shuffledProducts = res.data.sort(() => Math.random() - 0.5);
      setProducts(shuffledProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    fetchProducts(categoryName);
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container">
      <style>
        {`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            padding: 20px;
          }

          @media (max-width: 1200px) {
            .product-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 480px) {
            .product-grid {
              grid-template-columns: 1fr;
            }
          }

          .category-buttons {
            font-size: 24px;
            font-weight: bold;
            margin: 30px 20px 10px;
          }

          .button {
            margin-left: 10px;
            padding: 8px 16px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            background-color: #f0f0f0;
            border-radius: 4px;
            transition: background-color 0.3s;
          }

          .button:hover {
            background-color: #ddd;
          }
        `}
      </style>

      {/* Banner Slider */}
      <CategorySlider onBannerClick={handleCategoryClick} />

      {/* Shop by Category */}
      <CategoryStrip onCategorySelect={handleCategoryClick} />

      {/* Category Filter Buttons */}
      <div className="category-buttons">
        Products
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="button"
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Listing */}
      <div ref={productSectionRef} className="product-grid">
        {products.filter(p => p && p.id).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer */}
      <br />
      <br />
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Home;
