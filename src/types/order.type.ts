export type TOrderProduct = {
  _id: string;
  orderId: string; // Unique order ID
  userId: string; // User ID (MongoDB)
  customerName: string; // Customer full name
  customerEmail: string; // Customer email
  cancelDate: string; // Cancel date (if any)
  deliveryStatus: string; // e.g., "shipped", "pending", "delivered", "cancelled"
  refund: string; // e.g., "full amount", "partial amount", "none"
  status: string; // e.g., "approved", "rejected",
  productId: string; // refer product
  quantity: number; // Quantity ordered
  price: number; // Product price
  createdAt: string;
  updatedAt: string;
  __v: number;
};
