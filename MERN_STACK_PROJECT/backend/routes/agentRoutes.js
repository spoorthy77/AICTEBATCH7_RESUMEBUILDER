const express = require('express');
const router = express.Router();
const { 
  addAgent, 
  getAgents, 
  getAgentById,
  updateAgent,
  updateAgentTasks,
  deleteAgent
} = require('../controllers/agentController');
const auth = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', auth, addAgent);
router.get('/', auth, getAgents);
router.get('/:id', auth, getAgentById);
router.put('/:id', auth, updateAgent);
router.put('/:id/tasks', auth, updateAgentTasks);
router.delete('/:id', auth, deleteAgent);

module.exports = router;
