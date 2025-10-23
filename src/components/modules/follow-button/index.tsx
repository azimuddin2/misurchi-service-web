'use client';

import { Button } from '@/components/ui/button';
import { Plus, UserRoundMinus, UserRoundPlus } from 'lucide-react';
import {
  useFollowVendorMutation,
  useUnfollowVendorMutation,
  useGetVendorFollowersQuery,
} from '@/redux/features/follow/followApi';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

type FollowButtonProps = {
  vendorId: string;
  className?: string;
};

export default function FollowButton({
  vendorId,
  className,
}: FollowButtonProps) {
  const user = useAppSelector(selectCurrentUser);
  const userId = user?.userId;

  const {
    data: followersData,
    refetch,
    isFetching,
  } = useGetVendorFollowersQuery(vendorId);
  const [followVendor] = useFollowVendorMutation();
  const [unfollowVendor] = useUnfollowVendorMutation();

  const followersCount = followersData?.data?.followersCount ?? 0;
  const backendIsFollowing = followersData?.data?.isFollowing ?? false;

  // local state for instant UI update (optimistic)
  const [isFollowing, setIsFollowing] = useState(backendIsFollowing);
  useEffect(() => setIsFollowing(backendIsFollowing), [backendIsFollowing]);

  // FOLLOW
  const handleFollow = async () => {
    if (!userId) {
      toast.error('You must be logged in to follow');
      return;
    }

    setIsFollowing(true);
    const toastId = toast.loading('Following vendor...');

    try {
      const res = await followVendor(vendorId).unwrap();
      toast.success(res.message || 'Followed successfully!');
      refetch();
    } catch (error: any) {
      setIsFollowing(false);
      toast.error(error?.data?.message || 'Follow failed!');
    } finally {
      toast.dismiss(toastId);
    }
  };

  // UNFOLLOW
  const handleUnfollow = async () => {
    if (!userId) {
      toast.error('You must be logged in to unfollow');
      return;
    }

    setIsFollowing(false);
    const toastId = toast.loading('Unfollowing vendor...');

    try {
      const res = await unfollowVendor(vendorId).unwrap();
      toast.success(res.message || 'Unfollowed successfully!');
      refetch();
    } catch (error: any) {
      setIsFollowing(true);
      toast.error(error?.data?.message || 'Unfollow failed!');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 lg:mb-0 mb-5">
      {/* FOLLOW Button */}
      {!isFollowing && (
        <Button
          onClick={handleFollow}
          disabled={!userId}
          className={`p-6 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 ${className}`}
        >
          <UserRoundPlus />
          <span className="uppercase text-sm font-semibold">Follow</span>
        </Button>
      )}

      {/* UNFOLLOW Button */}
      {isFollowing && (
        <Button
          onClick={handleUnfollow}
          disabled={!userId}
          className={`p-6 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 ${className}`}
        >
          <UserRoundMinus />
          <span className="uppercase text-sm font-semibold">Unfollow</span>
        </Button>
      )}
    </div>
  );
}
