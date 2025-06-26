import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CategorySearchPage() {
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    } else {
      setError("No category specified");
      setLoading(false);
    }
  }, [categoryName]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/v1/products/category/byname?name=${encodeURIComponent(categoryName)}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
      toast.error("Failed to load products.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #f3f3f3",
              borderTop: "2px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>{error}</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div
      style={{ margin: "40px 0", textAlign: "center", padding: "20px" }}
    >
      <style>
        {`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
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
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Products in "{categoryName}"
      </h2>
      {products.length === 0 ? (
        <p>No products found in "{categoryName}"</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <br />
      <br />
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default CategorySearchPage;