const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Create a new todo
router.post('/', async (req, res) => {
  try {
    console.log('Received POST request:', req.body);
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const newTodo = new Todo({
      title,
      description
    });

    console.log('Saving todo:', newTodo);
    await newTodo.save();
    console.log('Todo saved successfully:', newTodo);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    });
  }
});

// Get all todos
router.get('/', async (req, res) => {
  try {
    console.log('GET request received for all todos');
    // Cosmos DB에서 정렬 없이 먼저 테스트
    const todos = await Todo.find();
    console.log('Todos fetched successfully:', todos.length, 'items');
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    });
  }
});

// Get a single todo by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
      error: error.message
    });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    });
  }
});

module.exports = router;
