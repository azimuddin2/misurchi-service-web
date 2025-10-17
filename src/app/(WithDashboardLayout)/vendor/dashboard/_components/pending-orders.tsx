import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetAllOrdersByUserQuery } from '@/redux/features/order/orderApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';

const PendingOrders = () => {
  const user = useAppSelector(selectCurrentUser);

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data, isLoading, refetch } = useGetAllOrdersByUserQuery({
    vendorId,
  });

  const orders = data?.data || [];

  return <div>{orders.length}</div>;
};

export default PendingOrders;
