import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  createApi,
} from '@reduxjs/toolkit/query/react';
import { BaseQueryApi, DefinitionType } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';
import { TResponse } from '../../types';
import { RootState } from '../store';
import { logout, setUser, TUser } from '../features/auth/authSlice';

// Base query using credentials (for sending cookies)
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include', // Send HttpOnly cookies
  // No need to manually set Authorization if using cookies
});

// Base query with automatic token refresh
const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = (await baseQuery(args, api, extraOptions)) as TResponse<TUser>;

  // 404 error
  if (result.error?.status === 404) {
    toast.error(result.error.data.message);
  }

  // Handle 401 and try refresh
  if (result.error?.status === 401) {
    try {
      const refreshRes = await fetch(
        'http://localhost:5000/api/auth/refresh-token',
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      const refreshData = await refreshRes.json();

      if (refreshData?.data?.accessToken) {
        // Optional: store token in Redux (not needed if using cookies only)
        const currentUser = (api.getState() as RootState).auth.user;
        api.dispatch(
          setUser({ user: currentUser, token: refreshData.data.accessToken }),
        );

        // Retry the original request
        result = (await baseQuery(args, api, extraOptions)) as TResponse<TUser>;
      } else {
        api.dispatch(logout());
      }
    } catch (refreshError) {
      api.dispatch(logout());
    }
  }

  return result;
};

// Create API
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
