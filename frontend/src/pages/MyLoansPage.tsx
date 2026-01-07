import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loansAPI } from "../services/api";
import Navbar from "../components/Navbar";
import LoanCard from "../components/LoanCard";
import "./MyLoansPage.css";

const MyLoansPage: React.FC = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [historyLoans, setHistoryLoans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data: any = await loansAPI.getMy();

      // Separate active and history loans
      const active = data.filter((loan: any) => loan.status === "active");
      const history = data.filter((loan: any) => loan.status === "returned");

      setLoans(data);
      setActiveLoans(active);
      setHistoryLoans(history);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch loans:", err);
      setError("Failed to load your loans.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    if (!window.confirm("Are you sure you want to return this book?")) {
      return;
    }

    try {
      await loansAPI.returnBook(loanId);
      alert("Book returned successfully!");
      fetchLoans(); // Refresh the list
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to return book.";
      alert(errorMessage);
    }
  };

  const displayedLoans = activeTab === "active" ? activeLoans : historyLoans;

  return (
    <div className="my-loans-page">
      <Navbar />

      <div className="loans-container">
        <div className="loans-header">
          <h1 className="loans-title">My Borrowed Books</h1>

          <div className="loans-tabs">
            <button
              className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active ({activeLoans.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History ({historyLoans.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading your loans...</div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        ) : displayedLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>
              {activeTab === "active" ? "No active loans" : "No loan history"}
            </h3>
            <p>
              {activeTab === "active"
                ? "You haven't borrowed any books yet."
                : "Your returned books will appear here."}
            </p>
            {activeTab === "active" && (
              <button
                onClick={() => navigate("/books")}
                className="browse-btn-empty"
              >
                Browse Books
              </button>
            )}
          </div>
        ) : (
          <div className="loans-list">
            {displayedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onReturn={handleReturn}
                showReturnButton={activeTab === "active"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoansPage;
