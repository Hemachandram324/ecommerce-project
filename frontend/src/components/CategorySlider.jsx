import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './CategorySlider.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategorySlider = ({ onBannerClick }) => {
  const navigate = useNavigate();

  const banners = [
    { name: 'T-shirts', img: '/images/BannerTshirts.jpg' },
    { name: 'Jeans', img: '/images/BannerJeans.jpg' },
    { name: 'Shoes', img: '/images/BannerShoes.jpg' },
    { name: 'Jackets', img: '/images/BannerJackets.jpg' },
    { name: 'Sunglasses', img: '/images/BannerSunglasses.jpg' },
    { name: 'Caps', img: '/images/BannerCaps.jpg' },
    { name: 'Shirts', img: '/images/BannerShirts.jpg' }
  ];

  const handleClick = (category) => {
    if (onBannerClick) onBannerClick(category);
    else navigate(`/category/${category}`);
  };

  const CustomPrevArrow = ({ onClick }) => (
    <div className="arrow prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div className="arrow next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    cssEase: 'ease-in-out',
    customPaging: (i) => (
      <div className="thumbnail-dot">
        <img src={banners[i].img} alt={banners[i].name} />
      </div>
    ),
    dotsClass: 'slick-dots slick-thumb'
  };

  return (
    <div className="category-slider">
      <Slider {...settings}>
        {banners.map((banner, i) => (
          <div key={i} className="slide" onClick={() => handleClick(banner.name)}>
            <img src={banner.img} alt={banner.name} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
