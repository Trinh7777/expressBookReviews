const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Customer already exists!" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 2 & Task 10: Get the book list available in the shop using Promise / async-await
public_users.get('/', function (req, res) {
    const getBooksPromise = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooksPromise
        .then((bookList) => {
            return res.status(200).send(JSON.stringify(bookList, null, 4));
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error retrieving books", error: error.message });
        });
});

// Task 3 & Task 11: Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBNPromise = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBNPromise
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 4 & Task 12: Get book details based on author using Promise / async-await
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
        let matchingBooks = [];
        const bookKeys = Object.keys(books);

        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push({ isbn: key, ...books[key] });
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found for author: ${author}` });
        }
    });

    getBooksByAuthorPromise
        .then((bookList) => {
            return res.status(200).json(bookList);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 5 & Task 13: Get all books based on title using Promise / async-await
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitlePromise = new Promise((resolve, reject) => {
        let matchingBooks = [];
        const bookKeys = Object.keys(books);

        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push({ isbn: key, ...books[key] });
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found with title: ${title}` });
        }
    });

    getBooksByTitlePromise
        .then((bookList) => {
            return res.status(200).json(bookList);
        })
        .catch((err) => {
            return res.status(err.status || 500).json({ message: err.message });
        });
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// -------------------------------------------------------------
// Functions demonstrating Async/Await with Axios (Tasks 10-13)
// -------------------------------------------------------------

// Task 10 with Axios & Async/Await:
const getBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error fetching books with Axios:", error.message);
        throw error;
    }
};

// Task 11 with Axios & Async/Await:
const getBookByISBNAsync = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book ISBN ${isbn} with Axios:`, error.message);
        throw error;
    }
};

// Task 12 with Axios & Async/Await:
const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author} with Axios:`, error.message);
        throw error;
    }
};

// Task 13 with Axios & Async/Await:
const getBookByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title} with Axios:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getBooksAsync = getBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBookByAuthorAsync = getBookByAuthorAsync;
module.exports.getBookByTitleAsync = getBookByTitleAsync;
