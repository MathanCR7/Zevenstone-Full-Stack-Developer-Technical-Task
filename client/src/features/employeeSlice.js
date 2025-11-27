// client/src/features/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- EMPLOYEE CRUD ACTIONS ---

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  // Updated to accept an object with department and status
  async ({ page, search, department = '', status = '' }, thunkAPI) => {
    try {
      // Pass params to URL
      const response = await api.get(`/employees?page=${page}&search=${search}&department=${department}&status=${status}`);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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

// --- AUDIT LOG ACTIONS ---

export const fetchAuditLogs = createAsyncThunk(
  'employees/fetchAudits',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/employees/audit-logs');
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
    'employees/fetchRecentActivity',
    async (_, thunkAPI) => {
      try {
        const response = await api.get('/employees/audit-logs');
        return response.data.data.slice(0, 5); 
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

// --- SLICE REDUCER ---

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],           
    logs: [],           
    recentActivity: [], 
    totalPages: 1,
    currentPage: 1,
    totalEmployees: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearEmployeeState: (state) => {
        state.error = null;
        state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.employees;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalEmployees = action.payload.totalEmployees;
      })
      .addCase(fetchEmployees.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalEmployees += 1;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp._id !== action.payload);
        state.totalEmployees -= 1;
      })
      .addCase(fetchAuditLogs.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload; 
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      });
  },
});

export const { clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;