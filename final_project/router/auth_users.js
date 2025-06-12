const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'user1', password: 'user1' },
];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.session?.authorization?.username
    const review = req?.query?.review
    // console.log({username, id:req.params.isbn, review})
    // console.log(books[req.params.isbn])
    if (!review || !review.length) {
        return res.status(400).send({'message': 'Review not found'})
    }

    if(!books[req.params.isbn]) {
        return res.status(400).send({'message': 'Book not found'})
    }

    const bookReviews = Object.assign({}, books[req.params.isbn].reviews)
    bookReviews[username] = review
    books[req.params.isbn].reviews = bookReviews
    return res.status(200).json({ message: "Review add for book", bookReviews });
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
    const username = req.session?.authorization?.username

    if(!books[req.params.isbn]) {
        return res.status(400).send({'message': 'Book not found'})
    }

    const bookReviews = Object.assign({}, books[req.params.isbn].reviews)
    delete bookReviews[username]
    books[req.params.isbn].reviews = bookReviews
    return res.status(200).json({ message: "Review add for book", bookReviews });
})


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;
