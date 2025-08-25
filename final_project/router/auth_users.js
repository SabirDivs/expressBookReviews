const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  firstName: "John",
  lastName: "wick",
  email: "johnwick@gamil.com",
  DOB: "22-01-1990",
},
{
  firstName: "John",
  lastName: "smith",
  email: "johnsmith@gamil.com",
  DOB: "21-07-1983",
},
{
  firstName: "Joyal",
  lastName: "white",
  email: "joyalwhite@gamil.com",
  DOB: "21-03-1989",
}
];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review (Task 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("/auth/review/:isbn hit ")
  const isbn = req.params.isbn;
  const review = req.query.review;  
  console.log("isbn, review: ", isbn, review)
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }

  if (books[isbn]) {
    let reviews = books[isbn].reviews;
    reviews[username] = review;
    return res.status(200).send("Review added/modified successfully");
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review (Task 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    let reviews = books[isbn].reviews;
    if (reviews[username]) {
      delete reviews[username];
      return res.status(200).send("Review deleted successfully");
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
