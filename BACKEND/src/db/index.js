//db index.js
require('dotenv').config();
const { MONGODB_URL } = process.env;
const mongoose = require('mongoose');


mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB 서버에 연결되었습니다. ' + MONGODB_URL);
});
db.on('error', err => {
    console.error('\nMongoDB 연결에 실패하였습니다...\n' + MONGODB_URL + '\n' + err);
});

module.exports = db;
