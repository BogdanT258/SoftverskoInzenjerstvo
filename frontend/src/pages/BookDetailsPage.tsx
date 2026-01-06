import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import "./BookDetailsPage.css";

// Mock data - same as BooksPage (later from API)
const mockBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Programming",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
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
    description:
      "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness.",
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
    description:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
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
    description:
      "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years. Whether you're new to the field or an experienced practitioner, you'll come away with fresh insights each and every time.",
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
    description:
      "No matter how much experience you have with JavaScript, odds are you don't fully understand the language. This concise yet in-depth guide takes you inside scope and closures, two core concepts you need to know to become a more efficient and effective JavaScript programmer.",
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
    description:
      "JavaScript lies at the heart of almost every modern web application. Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code.",
    publisher: "No Starch Press",
    publishYear: 2018,
    totalCopies: 4,
    availableCopies: 2,
    imageUrl:
      "https://m.media-amazon.com/images/I/91asIC1fRwL._AC_UF1000,1000_QL80_.jpg",
  },
];

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundBook = mockBooks.find((b) => b.id === Number(id));
      setBook(foundBook);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleBorrow = async () => {
    setBorrowing(true);
    // TODO: Implement actual borrow API call
    setTimeout(() => {
      alert("Book borrowed successfully! You have 14 days to return it.");
      setBorrowing(false);
      navigate("/my-loans");
    }, 1000);
  };

  const handleGoBack = () => {
    navigate("/books");
  };

  if (loading) {
    return (
      <div className="book-details-page">
        <Navbar />
        <div className="loading-container">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-page">
        <Navbar />
        <div className="error-container">
          <h2>Book not found</h2>
          <button onClick={handleGoBack} className="back-btn">
            ← Back to Books
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-details-page">
      <Navbar />

      <div className="book-details-container">
        <button onClick={handleGoBack} className="back-btn">
          ← Back to Books
        </button>

        <div className="book-details-content">
          {/* Left side - Image */}
          <div className="book-image-section">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="book-detail-image"
              />
            ) : (
              <div className="book-detail-placeholder">📚</div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="book-info-section">
            <span className="book-category-badge">{book.category}</span>
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>

            <div className="book-availability-status">
              <span
                className={`status-indicator ${
                  isAvailable ? "available" : "unavailable"
                }`}
              >
                {isAvailable ? "● Available" : "● Not Available"}
              </span>
              <span className="copies-info">
                {book.availableCopies} of {book.totalCopies} copies available
              </span>
            </div>

            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>

            <div className="book-details-grid">
              <div className="detail-item">
                <span className="detail-label">Publisher</span>
                <span className="detail-value">{book.publisher}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{book.publishYear}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ISBN</span>
                <span className="detail-value">{book.isbn}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Loan Period</span>
                <span className="detail-value">14 Days</span>
              </div>
            </div>

            <button
              className="borrow-book-btn"
              onClick={handleBorrow}
              disabled={!isAvailable || borrowing}
            >
              {borrowing
                ? "Borrowing..."
                : isAvailable
                ? "Borrow Book"
                : "Not Available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
