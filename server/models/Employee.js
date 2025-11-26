// server/models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First Name is required'] },
  lastName: { type: String, required: [true, 'Last Name is required'] },
  email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
  },
  // Added fields per requirements
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateOfJoining: { type: Date, default: Date.now },
  profilePhotoUrl: { type: String },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);