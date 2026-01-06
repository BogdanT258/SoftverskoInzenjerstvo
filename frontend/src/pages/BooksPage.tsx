import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import "./Bookspage.css";

// Mock data - later replace with API call
const mockBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Programming",
    description: "A Handbook of Agile Software Craftsmanship",
    publisher: "Prentice Hall",
    publishYear: 2008,
    totalCopies: 5,
    availableCopies: 3,
    imageUrl:
      "https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg",
  },
  {
    id: 2,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    description: "Comprehensive textbook on algorithms",
    publisher: "MIT Press",
    publishYear: 2009,
    totalCopies: 3,
    availableCopies: 2,
    imageUrl:
      "https://m.media-amazon.com/images/I/61Pgdn8Ys-L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Gang of Four",
    isbn: "978-0201633612",
    category: "Programming",
    description: "Elements of Reusable Object-Oriented Software",
    publisher: "Addison-Wesley",
    publishYear: 1994,
    totalCopies: 4,
    availableCopies: 4,
    imageUrl:
      "https://m.media-amazon.com/images/I/51szD9HC9pL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "978-0135957059",
    category: "Programming",
    description: "Your Journey To Mastery",
    publisher: "Addison-Wesley",
    publishYear: 2019,
    totalCopies: 3,
    availableCopies: 1,
    imageUrl:
      "https://m.media-amazon.com/images/I/71VvgGt3EFL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 5,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    isbn: "978-1491904244",
    category: "Programming",
    description: "Up & Going",
    publisher: "O'Reilly",
    publishYear: 2015,
    totalCopies: 5,
    availableCopies: 5,
    imageUrl:
      "https://m.media-amazon.com/images/I/71VKNel7WxL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 6,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    isbn: "978-1593279509",
    category: "Programming",
    description: "A Modern Introduction to Programming",
    publisher: "No Starch Press",
    publishYear: 2018,
    totalCopies: 4,
    availableCopies: 2,
    imageUrl:
      "https://m.media-amazon.com/images/I/91asIC1fRwL._AC_UF1000,1000_QL80_.jpg",
  },
];

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
  const [books, setBooks] = useState(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
