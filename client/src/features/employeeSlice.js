import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- EMPLOYEE CRUD ACTIONS ---

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async ({ page, search }, thunkAPI) => {
    try {
      const response = await api.get(`/employees?page=${page}&search=${search}`);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add Employee
export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employeeData, thunkAPI) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete Employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- NEW: AUDIT LOG ACTION ---

// Fetch Audit Logs (Admin Only)
export const fetchAuditLogs = createAsyncThunk(
  'employees/fetchAudits',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/employees/audit-logs');
      // The backend returns { success: true, data: [...] }
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- SLICE REDUCER ---

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],           // Employee list
    logs: [],           // Audit logs list
    totalPages: 1,
    currentPage: 1,
    totalEmployees: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Optional: Add reducers to manually clear state if needed
    clearEmployeeState: (state) => {
        state.error = null;
        state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Employees ---
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.employees;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalEmployees = action.payload.totalEmployees;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Add Employee ---
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalEmployees += 1;
      })

      // --- Update Employee ---
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) {
            state.list[index] = action.payload;
        }
      })

      // --- Delete Employee ---
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp._id !== action.payload);
        state.totalEmployees -= 1;
      })

      // --- NEW: Audit Logs Handlers ---
      .addCase(fetchAuditLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload; // Populate the logs array
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;