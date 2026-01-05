import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { sequelize, Users, Books, Loans } from "./models.js";
import { authenticateJWT, authorizeRoles } from "./middleware.js";

await sequelize.sync({alter:true});
console.log("Sihronizovana tabela");

const app = express();

app.use(cors({
    origin:process.env.FRONT_URL
}));

app.use(bodyParser.json());


app.post("/api/auth/register", async (req,res)=>{
    const {fullName, email, password, role, indexNumber} = req.body;

    if(!email || !password || !fullName) return res.status(400).json({message:"Missing required fields"});

    const existing = await Users.findOne({where:{email}});
    if(existing) return res.status(400).json({message:"Email already exists"});

    if(!validator.isEmail(email)) return res.status(400).json({message:"Invalid email format"});

    if(password.length < 6) return res.status(400).json({message:"Password must be at least 6 characters"});

    const hash = await bcrypt.hash(password, 10);

    const user = await Users.create({fullName, email, password: hash, role, index_number: indexNumber});
    res.status(201).json({
        message:"User registered successfully",
        user:{id:user.id, fullName:user.fullName, email:user.email, role:user.role}
    })
});

app.post("/api/auth/login", async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({message:"Missing email or password"});

    const user = await Users.findOne({where:{email}});
    if(!user) return res.status(401).json({message:"Invalid credentials"});

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});

    const token = jwt.sign({id:user.id, email:user.email, role:user.role}, process.env.JWT_SECRET, {expiresIn:"7d"});
    res.json({token, user:{id:user.id, email:user.email, fullName:user.fullName, role:user.role, indexNumber:user.index_number}});
});

app.get("api/books", authenticateJWT, async(req,res)=>{
    const books = await Books.findAll();
    res.json(books);
});

app.get("/api/books/:id", authenticateJWT,  async (req,res) => {
    const book = await Books.findByPk(req.params.id);
    if(!book) return res.status(404).json({message:"Book not found"});
    res.json(book);
});

app.post("/api/books", authenticateJWT, authorizeRoles("librarian"), async(req,res)=>{
    const {title, author, isbn, category, description, totalCopies, publisher, publishYear, imageUrl} = req.body;
    const currentYear = new Date().getFullYear();

    if(!title || !author || !isbn || !category || !description || !totalCopies || ! publisher || publishYear || imageUrl) return res.status(400).json({message:"You have to fill all the fields"});

    if(!validator.isInt(String(isbn))) return res.status(400).json({message:"Index number must only contain numbers"});

    if(!validator.isInt(String(publishYear))) return res.status(400).json({message:"Year of publishing must be in numbers"});

    if(publishYear > currentYear) return res.status(400).json({message:"Book cannot be published in future"});

    if(!validator.isURL(imageUrl,{
        require_protocol: false
    })){
        return res.status(400).json({message:"Invalid URL format"});
    }
    
    const existing = await Books.findOne({where:{isbn}});
    if(existing) return res.status(400).json({message:"Book by this isbn already exists"});

    const book = await Books.create({
        ...req.body,
        available_copies: req.body.totalCopies
    });
    res.status(201).json({message:"Book created successfully", book});
    
});

app.put("/api/books/:id", authenticateJWT, authorizeRoles("librarian"), async (req, res) => {
    const book = await Books.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const {title, author, isbn, category, description, totalCopies, publisher, publishYear, imageUrl} = req.body;

    if(!title || !author || !isbn || !category || !description || !totalCopies || ! publisher || publishYear || imageUrl) return res.status(400).json({message:"You have to fill all the fields"});

    if(!validator.isInt(String(isbn))) return res.status(400).json({message:"Index number must only contain numbers"});

    if(!validator.isInt(String(publishYear))) return res.status(400).json({message:"Year of publishing must be in numbers"});

    if(publishYear > currentYear) return res.status(400).json({message:"Book cannot be published in future"});

    if(!validator.isURL(imageUrl,{
        require_protocol: false
    })){
        return res.status(400).json({message:"Invalid URL format"});
    }

    await book.update({
        ...req.body,
        available_copies:req.body.totalCopies
    });
    res.status(201).json({ message: "Book updated successfully", book });
  }
);

app.delete("/api/books/:id", authenticateJWT, authorizeRoles("librarian"), async(req,res)=>{
    const activeLoans = await Loans.count({
        where:{book_id: req.params.id, status:"active"}
    });

    if(activeLoans > 0) return res.status(400).json({message:"Cannot delete book with active loans"});

    await Books.destroy({where:{id:req.params.id}});
    res.status(201).json({message:"Book deleted successfully"});
});

app.get("/api/loans/my", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    const loans = await Loans.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Books,
          attributes: ["id", "title", "author", "isbn"]
        }
      ],
      order: [["loan_date", "DESC"]]
    });

    const now = new Date();

    const result = loans.map(loan => {
      const isOverdue =
        loan.status === "active" &&
        loan.due_date < now;

      return {
        id: loan.id,
        book: loan.book,
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        returnDate: loan.return_date,
        status: loan.status,
        isOverdue
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/api/loans", authenticateJWT, authorizeRoles("librarian"), async (req, res) => {
  try {
    const loans = await Loans.findAll({
      include: [
        {
          model: Users,
          attributes: ["id", "full_name", "email", "index_number"]
        },
        {
          model: Books,
          attributes: ["id", "title", "author"]
        }
      ],
      order: [["loan_date", "DESC"]]
    });

    const now = new Date();

    const result = loans.map(loan => {
      const isOverdue =
        loan.status === "active" &&
        loan.due_date < now;

      return {
        id: loan.id,
        user: {
          id: loan.user.id,
          fullName: loan.user.full_name,
          email: loan.user.email,
          indexNumber: loan.user.index_number
        },
        book: {
          id: loan.book.id,
          title: loan.book.title,
          author: loan.book.author
        },
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        returnDate: loan.return_date,
        status: loan.status,
        isOverdue
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/loans", authenticateJWT, async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  if (!bookId) {
    return res.status(400).json({ message: "Id of book is required" });
  }

  const t = await sequelize.transaction();

  try {
    const book = await Books.findByPk(bookId, { transaction: t });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available_copies || book.available_copies <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Book not available" });
    }

    const activeLoan = await Loans.findOne({
      where: { user_id: userId, book_id: bookId, status: "active" },
      transaction: t
    });

    if (activeLoan) {
      await t.rollback();
      return res.status(400).json({ message: "User already has an active loan for this book" });
    }

    const overdueLoan = await Loans.findOne({
      where: {
        user_id: userId,
        status: "active",
        due_date: { [sequelize.Op.lt]: new Date() }
      },
      transaction: t
    });

    if (overdueLoan) {
      await t.rollback();
      return res.status(400).json({ message: "User has overdue books" });
    }

    const loanPeriodDays = 14;
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + loanPeriodDays);

    const loan = await Loans.create({
      user_id: userId,
      book_id: bookId,
      loan_date: now,
      due_date: dueDate,
      status: "active"
    }, { transaction: t });

    book.available_copies -= 1;
    await book.save({ transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Book borrowed successfully",
      loan: {
        id: loan.id,
        bookId: loan.book_id,
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        status: loan.status
      }
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("api/loans/:id/return", authenticateJWT, async (req, res) => {
  const loanId = req.params.id;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const loan = await Loans.findByPk(loanId, { transaction: t });
    if (!loan) {
      await t.rollback();
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.user_id !== userId) {
      await t.rollback();
      return res.status(403).json({ message: "Cannot return someone else's loan" });
    }

    if (loan.status === "returned") {
      await t.rollback();
      return res.status(400).json({ message: "Loan already returned" });
    }

    const now = new Date();
    loan.return_date = now;
    loan.status = "returned";
    await loan.save({ transaction: t });

    const book = await Books.findByPk(loan.book_id, { transaction: t });
    book.available_copies += 1;
    await book.save({ transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Book returned successfully",
      loan: {
        id: loan.id,
        returnDate: loan.return_date,
        status: loan.status
      }
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/auth/logout",authenticateJWT,async(req,res)=>{
    res.clearCookie("jwt");
    res.status(201).json({message:"Logged out"});
})

app.listen(process.env.PORT,()=>{
    console.log("Server is listening");
});
