const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Book list available in the shop using Promises (Task 10)
public_users.get('/',function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((booksData) => {
    res.send(JSON.stringify(booksData, null, 4));
  })
  .catch(() => {
    res.status(500).json({message: "Error getting books"});
  });
});

// Book details based on ISBN using Promises (Task 11)
public_users.get('/isbn/:isbn',function  
  (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook.then((book) => {
    res.send(book);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});
  
// Book details based on author using Promises (Task 12)
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    }
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found by this author");
    }
  });

  getBooksByAuthor.then((books) => {
    res.send(books);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});

// Get all books based on title using Promises (Task 13)
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    }
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle.then((books) => {
    res.send(books);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  });
});

//  Book review (Task 5)
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;