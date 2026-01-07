import { sequelize, Books } from "./models.js";

const seedBooks = async () => {
  try {
    console.log("🌱 Starting seed...");

    await sequelize.authenticate();
    console.log("✅ Database connected");

    await Books.destroy({ where: {} });
    console.log("🗑️  Cleared existing books");

    const books = [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Programming",
        description:
          "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
        publisher: "Prentice Hall",
        publish_year: 2008,
        total_copies: 5,
        available_copies: 5,
        image_url:
          "https://m.media-amazon.com/images/I/41xShlnTZTL._SY445_SX342_.jpg",
      },
      {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        isbn: "9780262033848",
        category: "Computer Science",
        description:
          "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor.",
        publisher: "MIT Press",
        publish_year: 2009,
        total_copies: 3,
        available_copies: 3,
        image_url:
          "https://m.media-amazon.com/images/I/61Pgdn8Ys-L._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Design Patterns",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        isbn: "9780201633612",
        category: "Programming",
        description:
          "Capturing a wealth of experience about the design of object-oriented software.",
        publisher: "Addison-Wesley",
        publish_year: 1994,
        total_copies: 4,
        available_copies: 4,
        image_url:
          "https://m.media-amazon.com/images/I/51szD9HC9pL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        isbn: "9780135957059",
        category: "Programming",
        description:
          "One of those rare tech books you'll read, re-read, and read again over the years.",
        publisher: "Addison-Wesley",
        publish_year: 2019,
        total_copies: 3,
        available_copies: 1,
        image_url:
          "https://m.media-amazon.com/images/I/71VvgGt3EFL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "You Don't Know JS: Scope & Closures",
        author: "Kyle Simpson",
        isbn: "9781491904244",
        category: "Programming",
        description:
          "No matter how much experience you have with JavaScript, odds are you don't fully understand the language.",
        publisher: "O'Reilly Media",
        publish_year: 2014,
        total_copies: 5,
        available_copies: 5,
        image_url:
          "https://m.media-amazon.com/images/I/71VKNel7WxL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        isbn: "9781593279509",
        category: "Programming",
        description:
          "JavaScript lies at the heart of almost every modern web application.",
        publisher: "No Starch Press",
        publish_year: 2018,
        total_copies: 4,
        available_copies: 2,
        image_url:
          "https://m.media-amazon.com/images/I/91asIC1fRwL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        isbn: "9780984782857",
        category: "Computer Science",
        description:
          "Learn how to uncover the hints and hidden details in a question, discover how to break down a problem.",
        publisher: "CareerCup",
        publish_year: 2015,
        total_copies: 6,
        available_copies: 4,
        image_url:
          "https://m.media-amazon.com/images/I/71b2pOs+iCL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Code Complete",
        author: "Steve McConnell",
        isbn: "9780735619678",
        category: "Programming",
        description:
          "Widely considered one of the best practical guides to programming.",
        publisher: "Microsoft Press",
        publish_year: 2004,
        total_copies: 3,
        available_copies: 3,
        image_url:
          "https://m.media-amazon.com/images/I/51FUfWc3XqL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "The Mythical Man-Month",
        author: "Frederick P. Brooks Jr.",
        isbn: "9780201835953",
        category: "Computer Science",
        description:
          "Few books on software project management have been as influential and timeless.",
        publisher: "Addison-Wesley",
        publish_year: 1995,
        total_copies: 2,
        available_copies: 2,
        image_url:
          "https://m.media-amazon.com/images/I/51I5g0oXM0L._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Refactoring",
        author: "Martin Fowler",
        isbn: "9780134757599",
        category: "Programming",
        description:
          "Refactoring is about improving the design of existing code.",
        publisher: "Addison-Wesley",
        publish_year: 2018,
        total_copies: 4,
        available_copies: 4,
        image_url:
          "https://m.media-amazon.com/images/I/71fAV-GnP8L._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson, Gerald Jay Sussman",
        isbn: "9780262510871",
        category: "Computer Science",
        description:
          "SICP has had a dramatic impact on computer science curricula over the past decade.",
        publisher: "MIT Press",
        publish_year: 1996,
        total_copies: 2,
        available_copies: 1,
        image_url:
          "https://m.media-amazon.com/images/I/51H17R%2BbW8L._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        isbn: "9780596517748",
        category: "Programming",
        description:
          "This authoritative book scrapes away bad features to reveal a subset of JavaScript that's more reliable.",
        publisher: "O'Reilly Media",
        publish_year: 2008,
        total_copies: 5,
        available_copies: 3,
        image_url:
          "https://m.media-amazon.com/images/I/71s1T5BpubL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Head First Design Patterns",
        author: "Eric Freeman, Elisabeth Robson",
        isbn: "9780596007126",
        category: "Programming",
        description:
          "At any given moment, somewhere in the world someone struggles with the same software design problems you have.",
        publisher: "O'Reilly Media",
        publish_year: 2004,
        total_copies: 4,
        available_copies: 2,
        image_url:
          "https://m.media-amazon.com/images/I/61APhXCksuL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "The Art of Computer Programming",
        author: "Donald E. Knuth",
        isbn: "9780201896831",
        category: "Computer Science",
        description:
          "The bible of all fundamental algorithms and the work that taught many of today's software developers.",
        publisher: "Addison-Wesley",
        publish_year: 1997,
        total_copies: 2,
        available_copies: 2,
        image_url:
          "https://m.media-amazon.com/images/I/71xQKGJlTBL._AC_UF1000,1000_QL80_.jpg",
      },
      {
        title: "Working Effectively with Legacy Code",
        author: "Michael Feathers",
        isbn: "9780131177055",
        category: "Programming",
        description:
          "This book provides programmers with the ability to cost effectively handle common legacy code problems.",
        publisher: "Prentice Hall",
        publish_year: 2004,
        total_copies: 3,
        available_copies: 3,
        image_url:
          "https://m.media-amazon.com/images/I/71qU8qSyAaL._AC_UF1000,1000_QL80_.jpg",
      },
    ];

    await Books.bulkCreate(books);

    console.log(`✅ Successfully added ${books.length} books!`);

    await sequelize.close();
    console.log("✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedBooks();
