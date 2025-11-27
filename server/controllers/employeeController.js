const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const ErrorResponse = require('../utils/errorResponse');

// Helper to log actions
const logAction = async (userId, action, target, details, ip) => {
  await AuditLog.create({ user: userId, action, targetResource: target, details, ip });
};

// @desc    Get all employees (Scoped by Role + Filtering)
exports.getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || '';
    const department = req.query.department || '';
    const status = req.query.status || '';

    // Build Query
    let query = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ]
    };

    // Apply Filters if provided
    if (department && department !== 'All Departments') {
        query.department = department;
    }
    if (status && status !== 'All Status') {
        query.status = status.toLowerCase(); // Ensure lowercase matching for 'active'/'inactive'
    }

    // RBAC: Supervisors only see their own employees
    if(req.user.role === 'supervisor') {
        query.managerId = req.user.id;
    }

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .populate('managerId', 'email')
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
  } catch (err) { next(err); }
};

// @desc    Create Employee
exports.createEmployee = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    // If supervisor, they must be the manager
    if(req.user.role === 'supervisor') {
        req.body.managerId = req.user.id;
    } else if (!req.body.managerId) {
        req.body.managerId = req.user.id;
    }

    const employee = await Employee.create(req.body);

    // Audit Log
    await logAction(req.user.id, 'CREATE', employee.email, `Created Employee ${employee.employeeId}`, req.ip);

    res.status(201).json({ success: true, data: employee });
  } catch (err) { next(err); }
};

// @desc    Update Employee
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) return next(new ErrorResponse(`Employee not found`, 404));

    // Enforce Supervisor Scope
    if(req.user.role === 'supervisor' && employee.managerId.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this employee', 403));
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await logAction(req.user.id, 'UPDATE', employee.email, `Updated Employee details`, req.ip);

    res.status(200).json({ success: true, data: employee });
  } catch (err) { next(err); }
};

// @desc    Delete Employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return next(new ErrorResponse(`Employee not found`, 404));

    // Enforce Supervisor Scope
    if(req.user.role === 'supervisor' && employee.managerId.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this employee', 403));
    }

    await employee.deleteOne();

    await logAction(req.user.id, 'DELETE', employee.email, `Deleted Employee ${employee.employeeId}`, req.ip);

    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};

// @desc    Get Audit Logs (Admin Only)
exports.getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .populate('user', 'email role')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json({ success: true, data: logs });
    } catch (err) { next(err); }
}