import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch Employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async ({ page, search }, thunkAPI) => {
    try {
      const response = await api.get(`/employees?page=${page}&search=${search}`);
      return response.data; // Expects { employees, totalPages, currentPage, ... }
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
      return response.data.data; // Backend returns { success: true, data: {...} }
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

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    totalPages: 1,
    currentPage: 1,
    totalEmployees: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; })
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
      // Add
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalEmployees += 1;
      })
      // Update
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp._id !== action.payload);
        state.totalEmployees -= 1;
      });
  },
});

export default employeeSlice.reducer;