import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CategoryStrip.css";

const categories = [
  { name: "Jeans", image: "/images/CSjeans.png", offer: "30-60% OFF" },
  { name: "T-shirts", image: "/images/CStshirts.png", offer: "40-80% OFF" },
  { name: "Shoes", image: "/images/CSshoes.png", offer: "UP TO 70% OFF" },
  { name: "Jackets", image: "/images/CSjackets.png", offer: "30-70% OFF" },
  { name: "Sunglasses", image: "/images/CSsunglasses.png", offer: "UP TO 60% OFF" },
  { name: "Caps", image: "/images/CScaps.png", offer: "UP TO 50% OFF" },
  { name: "Shirt", image: "/images/CSshirts.png", offer: "40-80% OFF" },
];

function CategoryStrip({ onCategorySelect }) {
  const navigate = useNavigate();

  const handleClick = (name) => {
    const encodedName = encodeURIComponent(name);
    if (onCategorySelect) {
      onCategorySelect(name); // Notify parent component (e.g., Home.jsx)
    }
    navigate(`/category/byname?name=${encodedName}`);
    toast.info(`Browsing ${name} category`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <h2 className="strip-title">Shop by Category</h2>
      <div className="category-strip">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="category-card"
            onClick={() => handleClick(cat.name)}
          >
            <img src={cat.image} alt={cat.name} />
            <h3>{cat.name}</h3>
            <p>{cat.offer}</p>
            <button>Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryStrip;