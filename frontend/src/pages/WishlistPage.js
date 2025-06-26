import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.warn("Please log in to view your wishlist.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    fetchWishlist();
  }, [token, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/wishlist/list");
      setWishlist(res.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist.", {
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

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/v1/wishlist/remove/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      toast.info("Removed from wishlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error removing product:", err);
      toast.error("Failed to remove from wishlist.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  return (
    <div style={{ padding: "20px" }}>
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
        My Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <p>No products in wishlist.</p>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <div key={product.id} style={{ position: "relative" }}>
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                title="Remove from wishlist"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  color: "black",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                ✖
              </button>
            </div>
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

export default WishlistPage;