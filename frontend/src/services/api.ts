import axios from "axios";
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Book,
  CreateBookData,
  Loan,
  CreateLoanData,
} from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============= AUTH API =============

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

// ============= BOOKS API =============

export const booksAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
  }): Promise<Book[]> => {
    const response = await api.get("/books", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (data: CreateBookData): Promise<Book> => {
    const response = await api.post("/books", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateBookData>): Promise<Book> => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

// ============= LOANS API =============

export const loansAPI = {
  getMy: async (): Promise<Loan[]> => {
    const response = await api.get("/loans/my");
    return response.data;
  },

  getAll: async (params?: {
    status?: string;
    userId?: number;
  }): Promise<Loan[]> => {
    const response = await api.get("/loans", { params });
    return response.data;
  },

  create: async (data: CreateLoanData): Promise<Loan> => {
    const response = await api.post("/loans", data);
    return response.data;
  },

  returnBook: async (loanId: number): Promise<Loan> => {
    const response = await api.put(`/loans/${loanId}/return`);
    return response.data;
  },
};

export default api;
