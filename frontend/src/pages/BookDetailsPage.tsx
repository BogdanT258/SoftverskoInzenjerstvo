import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { booksAPI, loansAPI } from "../services/api";
import Navbar from "../components/Navbar";
import "./BookDetailsPage.css";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // Tvoj api.ts već vraća data direktno!
        const bookData: any = await booksAPI.getById(Number(id));

        // Format book data
        const formattedBook = {
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          category: bookData.category,
          description: bookData.description,
          publisher: bookData.publisher,
          publishYear: bookData.publish_year, // ✅ POPRAVI
          totalCopies: bookData.total_copies, // ✅ POPRAVI
          availableCopies: bookData.available_copies, // ✅ POPRAVI
          imageUrl: bookData.image_url, // ✅ POPRAVI
        };

        setBook(formattedBook);
        setError("");
      } catch (err: any) {
        console.error("Failed to fetch book:", err);
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleBorrow = async () => {
    if (!book) return;

    setBorrowing(true);
    try {
      // Tvoj api.ts koristi loansAPI.create() sa CreateLoanData
      await loansAPI.create({ bookId: book.id });
      alert("Book borrowed successfully! You have 14 days to return it.");
      navigate("/my-loans");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to borrow book. Please try again.";
      alert(errorMessage);
    } finally {
      setBorrowing(false);
    }
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

  if (error || !book) {
    return (
      <div className="book-details-page">
        <Navbar />
        <div className="error-container">
          <h2>{error || "Book not found"}</h2>
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
