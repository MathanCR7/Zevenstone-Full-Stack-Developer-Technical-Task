// server/routes/employeeRoutes.js
const express = require('express');
const { 
    getEmployees, 
    createEmployee, 
    getEmployee, 
    updateEmployee, 
    deleteEmployee 
} = require('../controllers/employeeController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router
  .route('/')
  .get(getEmployees)
  .post(createEmployee); // Supervisors can create

router
  .route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee); // Supervisors can delete employees they manage

module.exports = router;