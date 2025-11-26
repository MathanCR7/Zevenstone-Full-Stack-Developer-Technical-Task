// server/controllers/employeeController.js
const Employee = require('../models/Employee');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all employees (Pagination + Search)
// @route   GET /api/employees
exports.getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const startIndex = (page - 1) * limit;

    // Search Logic
    const query = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    };

    // Optional: Supervisors only see their own employees
    // if(req.user.role === 'supervisor') { query.managerId = req.user.id; }

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalEmployees: total,
      employees
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
exports.createEmployee = async (req, res, next) => {
  try {
    // Add user to body to track who created it
    req.body.createdBy = req.user.id;
    
    // Default manager to current user if not provided
    if(!req.body.managerId) req.body.managerId = req.user.id;

    const employee = await Employee.create(req.body);

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
    }

    // Role check logic could go here (e.g., only Admin can change Dept)

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
    }

    await employee.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};