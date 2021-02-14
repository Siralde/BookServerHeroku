//Data Base Module
const mongoose = require('mongoose');
const MONGO_ATLAS = "mongodb+srv://heroku:aldemaro@cluster0.oh67k.mongodb.net/books?retryWrites=true&w=majority";

//Server Module
const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io") (server, {cors:{origin: "*"}});

//Book Handler Module
const Book = require('./models/book');

io.on('connection', socket => {

    socket.on('books', () => {
        Book.find( {} ).then( book => {
            socket.emit('bookList', book);
        });
    })

    socket.on('changeName', (data) => {
        const { _id, newName } = data;
        Book.findByIdAndUpdate(_id, {name: newName}, (err, result) =>{console.log(result)});
    })

    socket.on('changeDescription', (data) => {
        const { _id, newDescription } = data;
        Book.findByIdAndUpdate(_id, {description: newDescription}, (err, result) =>{ console.log(result) });
    })

    socket.on('disconnect', () => {
        console.log('User left');
    })
})

const SERVER_PORT = process.env.PORT || 3002;

mongoose.connect( MONGO_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true  } )
        .then( () => {
            server.listen(SERVER_PORT, () => console.log(`Server has started on Port: ${SERVER_PORT}`));
        })