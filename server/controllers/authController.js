// server/controllers/authController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorResponse('Please provide email and password', 400));

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

exports.register = async (req, res, next) => {
  // Logic to register users (restricted to Admin in middleware)
  try {
     const user = await User.create(req.body);
     res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  res.status(statusCode).json({
    success: true,
    token,
    user: { id: user._id, email: user.email, role: user.role }
  });
};