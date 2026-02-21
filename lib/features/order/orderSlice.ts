// import { orderService } from '@/api/services/api.service';
// import { Order, CreateOrderInput } from '@/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../../api/services/api.service';
import { CreateOrderInput, Order } from '../../../types';

interface OrdersState {
  myOrders: Order[];
  allOrders: Order[];
  current: Order | null;
  clientSecret: string | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
}

const initialState: OrdersState = {
  myOrders: [], allOrders: [], current: null,
  clientSecret: null, isLoading: false, isCreating: false,
  error: null, meta: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data: CreateOrderInput, { rejectWithValue }) => {
    try {
      const res = await orderService.create(data);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const res = await orderService.getMyOrders(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const res = await orderService.getAll(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await orderService.getById(id);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await orderService.cancel(id);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cannot cancel order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const res = await orderService.updateStatus(id, status);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearClientSecret: (state) => { state.clientSecret = null; },
    clearOrderError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isCreating = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.current = action.payload.order;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false; state.error = action.payload as string;
      })
      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myOrders = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.myOrders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.myOrders[idx] = action.payload;
        state.current = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.allOrders[idx] = action.payload;
      });
  },
});

export const { clearClientSecret, clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;