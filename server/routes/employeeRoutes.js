const express = require('express');
const { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    getAuditLogs 
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

// Admin Only Route for Audit Logs
router.get('/audit-logs', authorize('admin'), getAuditLogs);

module.exports = router;