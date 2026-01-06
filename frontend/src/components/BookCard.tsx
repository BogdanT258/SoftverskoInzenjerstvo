import React from "react";
import "./BookCard.css";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publisher?: string;
  publishYear?: number;
  totalCopies: number;
  availableCopies: number;
  imageUrl?: string;
}

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-card-image-container">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="book-card-image"
          />
        ) : (
          <div className="book-card-placeholder">📚</div>
        )}

        {/* Availability badge */}
        <div
          className={`availability-badge ${
            isAvailable ? "available" : "unavailable"
          }`}
        >
          {isAvailable ? `${book.availableCopies} Available` : "Not Available"}
        </div>
      </div>

      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>

        <div className="book-card-footer">
          <span className="book-card-category">{book.category}</span>
          <button className="view-details-btn">View details →</button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
