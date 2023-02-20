const express = require('express');
const app = express();
const connectDB = require('./database')


app.use(express.json());

//for public folder
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html');
})

let PORT = process.env.PORT || 3000;

//connecting database
connectDB();
//requiring the model
const Comment = require('./models/comment');


//routes
app.post('/api/comments', (req, res) => {

    // console.log('this is api comment', req.body);

    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })

    comment.save().then(response => {
        res.send(response);
    })

});

app.get('/api/comments', (req, res) => {

    Comment.find().then(result => {
        res.send(result);
    })
})

const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(`New Connection id is ${socket.id}`);

    //recieving event from browers
    socket.on('comment', (data) => {
        data.time = new Date();
        socket.broadcast.emit('comment', data);
    });

    socket.on('typing', (data) => {
        console.log(data);
        socket.broadcast.emit('typing', data)
    })
})