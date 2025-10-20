export type TVendorDashboardStats = {
  pendingOrders: number;
  pendingBookings: number;
  totalSchedule: number;
  totalSales: number;
};

// --- Single Pending Order ---
export type TPendingOrder = {
  _id: string;
  orderId: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string; // ISO date string
};

// --- Single Today's Booking ---
export type TTodayBooking = {
  _id: string;
  name: string;
  serviceName: string;
  time: string;
  status: string;
  createdAt: string; // ISO date string
};

// --- Recent Activity (either order or booking) ---
export type TRecentActivity = {
  _id: string;
  type: 'order' | 'booking';
  name: string;
  status: string;
  createdAt: string;
  // for orders
  amount?: number;
  // for bookings
  service?: string;
  date?: string;
  time?: string;
};

// --- Main Dashboard Data ---
export type TVendorDashboardData = {
  pendingOrders: TPendingOrder[];
  todayBookings: TTodayBooking[];
  recentActivity: TRecentActivity[];
};
