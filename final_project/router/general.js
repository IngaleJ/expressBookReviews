const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    const booksCpy = books
    const getBooks = new Promise((resolve) => {
        setTimeout(() => resolve(booksCpy), 200)
    })

    getBooks.then((data) => {
        return res.send(JSON.stringify(data, null, 2));
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    if (req?.params?.isbn) {
        const getBook = new Promise((resolve)=> {
            return setTimeout(()=> resolve(books[req.params.isbn]), 200)
        })

        getBook.then((data)=>{
            return res.status(200).json(data);
        })
    } else {
        return res.status(300).json({ message: "Please give isbn number" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req?.params?.author
    const getBookByAuhtor = new Promise((resolve)=> {
        const booksByAuthor = []
        Object.values(books).forEach(book => {
            if (book.author === author) {
                booksByAuthor.push(book)
            }
        })
        return setTimeout(()=> resolve(booksByAuthor), 200)
    })
    getBookByAuhtor.then((data)=>{
        return res.status(200).json(data);
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req?.params?.title
    const getBookByTitle = new Promise (resolve => {
        const booksByTitle = []
        Object.values(books).forEach(book => {
            if (book.title === title) {
                booksByTitle.push(book)
            }
        })
        setTimeout(()=> resolve(booksByTitle), 200)
    })
    getBookByTitle.then((data)=>{
        return res.status(200).json(data);
    })
    
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    if (req?.params?.isbn) {
        return res.status(200).json(books[req.params.isbn].reviews);
    } else {
        return res.status(300).json({ message: "Please give isbn number" });
    }
});

module.exports.general = public_users;
