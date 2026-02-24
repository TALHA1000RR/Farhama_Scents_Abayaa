'use client';
import { useCallback, useEffect } from 'react';
import { fetchMyOrders, createOrder, cancelOrder, fetchAllOrders, fetchOrderById, updateOrderStatus, clearClientSecret, clearOrderError } from '../lib/features/order/orderSlice';
import { useAppDispatch, useAppSelector } from '../lib/store';
import { CreateOrderInput, Order } from '../types';


/**
 * useOrders — order management hook for both customers and admins.
 *
 * Customer usage:
 *  - myOrders           User's own order history
 *  - placeOrder(data)   Create a new order → { success, data: { order, clientSecret } }
 *  - cancel(orderId)    Cancel a pending order → boolean
 *
 * Admin usage:
 *  - allOrders          All orders in the system
 *  - fetchAll(params?)  Load all orders (optional filters)
 *  - changeStatus(id, status)  Update an order's status → boolean
 *
 * Shared:
 *  - current            Single order loaded by fetchById
 *  - clientSecret       Stripe client secret from the latest placeOrder call
 *  - isLoading          True while fetching orders
 *  - isCreating         True while a new order is being created
 *  - error              Last error string (or null)
 *  - meta               Pagination metadata
 *  - getById(id)        Load a single order by ID
 *  - resetClientSecret()  Clear the Stripe client secret from state
 *  - resetError()         Clear the error from state
 */
export function useOrders() {
  const dispatch = useAppDispatch();
  const { myOrders, allOrders, current, clientSecret, isLoading, isCreating, error, meta } =
    useAppSelector((s) => s.orders);
  const { user } = useAppSelector((s) => s.auth);

  // Auto-load the logged-in user's orders whenever the user changes
  useEffect(() => {
    if (user) {
      dispatch(fetchMyOrders(undefined));
    }
  }, [user, dispatch]);

  const placeOrder = useCallback(
    async (data: CreateOrderInput): Promise<{ success: boolean; data?: any; error?: string }> => {
      const result = await dispatch(createOrder(data));
      if (createOrder.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch],
  );

  const cancel = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(cancelOrder(id));
      return cancelOrder.fulfilled.match(result);
    },
    [dispatch],
  );

  const fetchAll = useCallback(
    (params?: Record<string, string>) => {
      dispatch(fetchAllOrders(params));
    },
    [dispatch],
  );

  const getById = useCallback(
    (id: string) => dispatch(fetchOrderById(id)),
    [dispatch],
  );

  const changeStatus = useCallback(
    async (id: string, status: Order['status']): Promise<boolean> => {
      const result = await dispatch(updateOrderStatus({ id, status }));
      return updateOrderStatus.fulfilled.match(result);
    },
    [dispatch],
  );

  return {
    myOrders,
    allOrders,
    current,
    clientSecret,
    isLoading,
    isCreating,
    error,
    meta,
    placeOrder,
    cancel,
    fetchAll,
    getById,
    changeStatus,
    resetClientSecret: () => dispatch(clearClientSecret()),
    resetError: () => dispatch(clearOrderError()),
  };
}