const mongoose = require('mongoose')

const url = <your mongodb url />

function connectDB() {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected. ');
    }).on('error', err => {
        console.log('error')
    });
}

module.exports = connectDB;