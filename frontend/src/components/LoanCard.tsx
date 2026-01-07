import React from "react";
import "./LoanCard.css";

interface LoanCardProps {
  loan: any;
  onReturn: (loanId: number) => void;
  showReturnButton: boolean;
}

const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  onReturn,
  showReturnButton,
}) => {
  const isOverdue = loan.isOverdue;
  const loanDate = new Date(loan.loanDate);
  const dueDate = new Date(loan.dueDate);
  const returnDate = loan.returnDate ? new Date(loan.returnDate) : null;

  // Calculate days remaining or overdue
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`loan-card ${isOverdue ? "overdue" : ""}`}>
      {/* Book Cover */}
      <div className="loan-book-cover">
        {loan.book?.imageUrl ? (
          <img src={loan.book.imageUrl} alt={loan.book.title} />
        ) : (
          <div className="loan-cover-placeholder">📚</div>
        )}
      </div>

      {/* Loan Info */}
      <div className="loan-info">
        <div className="loan-header">
          <div>
            <h3 className="loan-book-title">
              {loan.book?.title || "Unknown Book"}
            </h3>
            <p className="loan-book-author">
              by {loan.book?.author || "Unknown Author"}
            </p>
          </div>
          <div
            className={`loan-status-badge ${
              isOverdue ? "overdue" : loan.status
            }`}
          >
            {isOverdue
              ? "🔴 Overdue"
              : loan.status === "active"
              ? "● Active"
              : "✓ Returned"}
          </div>
        </div>

        <div className="loan-details">
          <div className="loan-detail-row">
            <span className="detail-icon">📅</span>
            <span className="detail-label">Borrowed:</span>
            <span className="detail-value">{formatDate(loanDate)}</span>
          </div>

          <div className="loan-detail-row">
            <span className="detail-icon">📆</span>
            <span className="detail-label">Due Date:</span>
            <span className="detail-value">{formatDate(dueDate)}</span>
          </div>

          {returnDate && (
            <div className="loan-detail-row">
              <span className="detail-icon">✅</span>
              <span className="detail-label">Returned:</span>
              <span className="detail-value">{formatDate(returnDate)}</span>
            </div>
          )}
        </div>

        {/* Days remaining/overdue indicator */}
        {loan.status === "active" && (
          <div className={`loan-time-indicator ${isOverdue ? "overdue" : ""}`}>
            {isOverdue ? (
              <>⚠️ {Math.abs(diffDays)} days overdue!</>
            ) : (
              <>✅ {diffDays} days remaining</>
            )}
          </div>
        )}
      </div>

      {/* Return Button */}
      {showReturnButton && (
        <div className="loan-actions">
          <button className="return-btn" onClick={() => onReturn(loan.id)}>
            Return Book →
          </button>
        </div>
      )}
    </div>
  );
};

export default LoanCard;
