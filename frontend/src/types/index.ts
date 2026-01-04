// User types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: "student" | "librarian";
  indexNumber?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  indexNumber?: string;
  role: "student" | "librarian";
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Book types
export interface Book {
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

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  publisher?: string;
  publishYear?: number;
  totalCopies: number;
  imageUrl?: string;
}

// Loan types
export interface Loan {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  user?: {
    id: number;
    fullName: string;
    email: string;
    indexNumber?: string;
  };
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue";
  isOverdue?: boolean;
}

export interface CreateLoanData {
  bookId: number;
}

// API Error type
export interface ApiError {
  error: string;
  message: string;
}
