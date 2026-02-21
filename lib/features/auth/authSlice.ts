import { authService } from '@/api/services/api.service';
import { User, RegisterInput, LoginInput } from '@/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { authService } from '../services/api.services';
// import type { User, RegisterInput, LoginInput } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  if (token && userStr) {
    try { return { accessToken: token, user: JSON.parse(userStr) as User }; }
    catch { return null; }
  }
  return null;
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      const { accessToken, refreshToken, user } = res.data.data!;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { accessToken, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      const { accessToken, refreshToken, user } = res.data.data!;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { accessToken, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout(); } catch { /* ignore */ }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // initialize
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        }
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => { state.isInitialized = true; })

      // register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;