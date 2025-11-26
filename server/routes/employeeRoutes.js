const express = require('express');
const router = express.Router();
const { 
  getEmployees, 
  createEmployee, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employeeController');

// Define routes
router.get('/', getEmployees);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;