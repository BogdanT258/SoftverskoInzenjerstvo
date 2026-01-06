import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Featured book (hardcoded for now - later from API)
  const featuredBook = {
    title: "Clean Code",
    author: "Robert C. Martin",
    rating: 4.7,
    totalRatings: 1800,
    imageUrl:
      "https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    availableCopies: 3,
    totalCopies: 5,
    category: "Programming",
  };

  const handleBrowseBooks = () => {
    navigate("/books");
  };

  const handleBorrowBook = () => {
    // Later: implement borrow functionality
    alert("Borrow functionality coming soon!");
  };

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-container">
        <div className="hero-card">
          {/* Left side - Hero text */}
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Your
              <br />
              <span className="hero-title-accent">Next Great</span>
              <br />
              Read
            </h1>

            <p className="hero-description">
              Explore our curated collection of books across multiple genres.
              Borrow, read, and return at your own pace.
            </p>

            <div className="hero-stats">
              <div className="stat-badge">
                <span className="star-icon">⭐</span>
                <span className="stat-value">{featuredBook.rating}</span>
              </div>
              <span className="stat-text">
                from {featuredBook.totalRatings}+ readers
              </span>
            </div>
          </div>

          {/* Center - Book image */}
          <div className="book-showcase">
            <img
              src={featuredBook.imageUrl}
              alt={featuredBook.title}
              className="book-cover"
            />
          </div>

          {/* Right side - Borrow card */}
          <div className="borrow-card">
            <div className="borrow-header">
              <h3 className="book-title">{featuredBook.title}</h3>
              <button className="favorite-btn">🔖</button>
            </div>

            <p className="book-author">by {featuredBook.author}</p>

            <div className="borrow-details">
              <div className="detail-group">
                <span className="detail-label">📅 Borrow Period</span>
                <span className="detail-value">14 Days</span>
              </div>

              <div className="detail-group">
                <span className="detail-label">💰 Cost</span>
                <span className="detail-value">Free</span>
              </div>

              <div className="detail-group">
                <span className="detail-label">📚 Available</span>
                <span className="detail-value">
                  {featuredBook.availableCopies} of {featuredBook.totalCopies}
                </span>
              </div>

              <div className="detail-group">
                <span className="detail-label">📂 Category</span>
                <span className="detail-value">{featuredBook.category}</span>
              </div>
            </div>

            <button
              className="borrow-btn"
              onClick={handleBorrowBook}
              disabled={featuredBook.availableCopies === 0}
            >
              {featuredBook.availableCopies > 0
                ? "Borrow Book"
                : "Not Available"}
            </button>

            <button className="browse-btn" onClick={handleBrowseBooks}>
              Browse All Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
