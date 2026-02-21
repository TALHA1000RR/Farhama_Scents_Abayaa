
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../../api/services/api.service';
import { DashboardStats, Product, HeroSlide } from '../../../types';

interface Order {
  _id: string;
  [key: string]: any;
}


interface AdminState {
  stats: DashboardStats | null;
  recentOrders: Order[];
  lowStockProducts: Product[];
  ordersByStatus: { _id: string; count: number }[];
  heroSlides: HeroSlide[];
  revenueData: { _id: { month: number }; revenue: number; orders: number }[];
  topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null, recentOrders: [], lowStockProducts: [],
  ordersByStatus: [], heroSlides: [], revenueData: [], topProducts: [],
  isLoading: false, error: null,
};

export const fetchDashboard = createAsyncThunk(
  'admin/dashboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminService.getDashboard();
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard');
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'admin/revenue',
  async (year: number | undefined, { rejectWithValue }) => {
    try {
      const res = await adminService.getRevenueAnalytics(year);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchHeroSlides = createAsyncThunk('admin/heroSlides', async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getHeroSlides();
    return res.data.data!;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createHeroSlide = createAsyncThunk(
  'admin/createSlide',
  async (data: Partial<HeroSlide>, { rejectWithValue }) => {
    try {
      const res = await adminService.createHeroSlide(data);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const updateHeroSlide = createAsyncThunk(
  'admin/updateSlide',
  async ({ id, data }: { id: string; data: Partial<HeroSlide> }, { rejectWithValue }) => {
    try {
      const res = await adminService.updateHeroSlide(id, data);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const deleteHeroSlide = createAsyncThunk(
  'admin/deleteSlide',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminService.deleteHeroSlide(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.lowStockProducts = action.payload.lowStockProducts;
        state.ordersByStatus = action.payload.ordersByStatus;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueData = action.payload;
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.heroSlides = action.payload;
      })
      .addCase(createHeroSlide.fulfilled, (state, action) => {
        state.heroSlides.push(action.payload);
      })
      .addCase(updateHeroSlide.fulfilled, (state, action) => {
        const idx = state.heroSlides.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.heroSlides[idx] = action.payload;
      })
      .addCase(deleteHeroSlide.fulfilled, (state, action) => {
        state.heroSlides = state.heroSlides.filter(s => s._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;