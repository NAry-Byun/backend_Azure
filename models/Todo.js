const mongoose = require('mongoose');
const todoSchema = require('./todoSchema');

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
