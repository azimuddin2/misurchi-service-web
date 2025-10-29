'use client';

import CustomAvatar from '@/components/shared/custom-avatar';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { cn } from '@/lib/utils';
import { calculateTime } from '@/utils/calculateTime';

const UserCard = ({
  user,
  setChatId,
  selectedUserId,
}: {
  user: any;
  setChatId?: any;
  selectedUserId?: string;
}) => {
  const updateSearchParams = useUpdateSearchParams();

  // Handle click event: navigate + set selected chat
  const handleSelectUser = () => {
    updateSearchParams({ selectedUserId: user?.userData?._id });
    setChatId(user?.message?.chat);
  };

  return (
    <div
      onClick={handleSelectUser}
      className={cn(
        // Base container styles
        'flex items-center gap-2 m-3 p-3 rounded-sm cursor-pointer transition-all duration-200 ease-in-out',

        // Hover and selected effects
        selectedUserId === user?.userData?._id
          ? 'bg-green-50 text-gray-200 shadow-md'
          : 'hover:bg-gray-100/80 bg-white',

        // Border and spacing
        'border border-gray-100 hover:shadow-sm',
      )}
    >
      {/* User Avatar */}
      <CustomAvatar
        img={user?.userData?.image}
        name={user?.userData?.fullName}
        className="size-12 rounded-full ring-2 ring-transparent hover:ring-primary-blue transition-all"
      />

      {/* Message Info */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Top Row: Name + Time */}
        <div className="flex justify-between items-center w-full">
          <h4
            className={cn(
              'font-semibold text-sm truncate max-w-[160px]',
              selectedUserId === user?.userData?._id
                ? 'text-gray-800'
                : 'text-gray-800',
            )}
          >
            {user?.userData?.fullName}
          </h4>

          <span
            className={cn(
              'text-xs font-medium',
              selectedUserId === user?.userData?._id
                ? 'text-gray-500'
                : 'text-gray-500',
            )}
          >
            {calculateTime(user?.message?.createdAt)}
          </span>
        </div>

        {/* Bottom Row: Last Message + Unread Count */}
        <div className="flex justify-between items-center mt-1">
          <p
            className={cn(
              'truncate text-sm text-gray-600',
              user?.unseen && 'font-semibold text-gray-800',
              selectedUserId === user?.userData?._id && 'text-gray-600',
            )}
          >
            {user?.message?.text
              ? user?.message?.text?.length > 36
                ? user?.message?.text?.slice(0, 36) + '...'
                : user?.message?.text
              : user?.message?.imageUrl?.length
                ? `${user?.message?.imageUrl?.length} ${
                    user?.message?.imageUrl?.length > 1 ? 'Images' : 'Image'
                  }`
                : ''}
          </p>

          {/* Unread Message Badge */}
          {user?.unseenMessage && selectedUserId !== user?.userData?._id && (
            <span className="text-xs font-medium bg-green-600 text-white px-2 py-[2px] rounded-full shadow-sm">
              {user?.unseenMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
