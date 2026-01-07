import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { booksAPI } from "../services/api";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import "./Bookspage.css";

const categories = [
  "All",
  "Programming",
  "Computer Science",
  "Fiction",
  "Science",
  "History",
  "Business",
];

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Tvoj api.ts već vraća data direktno!
        const data = await booksAPI.getAll();

        // Map backend fields to frontend format
        const formattedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          description: book.description,
          publisher: book.publisher,
          publishYear: book.publish_year,
          totalCopies: book.total_copies,
          availableCopies: book.available_copies,
          imageUrl: book.image_url,
        }));

        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks);
        setError("");
      } catch (err: any) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on category and search
  useEffect(() => {
    let result = books;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((book) => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(result);
  }, [selectedCategory, searchQuery, books]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="books-page">
      <Navbar />

      <div className="books-container">
        {/* Header with Categories and Search */}
        <div className="books-header">
          <div className="categories-bar">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div
            className={`search-container ${searchExpanded ? "expanded" : ""}`}
          >
            <button
              className="search-icon-btn"
              onClick={() => setSearchExpanded(!searchExpanded)}
            >
              🔍
            </button>
            {searchExpanded && (
              <input
                type="text"
                className="search-input"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            )}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="loading-state">Loading books...</div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="clear-search-btn"
            >
              Retry
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p>No books found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="clear-search-btn"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
