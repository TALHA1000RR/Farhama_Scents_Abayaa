import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../../api/services/api.service';
import { Product } from '../../../types';


interface ProductsState {
  items: Product[];
  featured: Product[];
  current: Product | null;
  isLoading: boolean;
  error: string | null;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
}

const initialState: ProductsState = {
  items: [], featured: [], current: null,
  isLoading: false, error: null, meta: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: Record<string, string | number> | undefined, { rejectWithValue }) => {
    try {
      const res = await productService.getAll(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const res = await productService.getAll({ featured: 'true', limit: 8 });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productService.getById(id);
      return res.data.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: { clearCurrentProduct: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;