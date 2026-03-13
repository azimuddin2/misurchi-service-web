'use client';

import CustomAvatar from '@/components/shared/custom-avatar';
import Empty from '@/components/shared/empty';
import { Input } from '@/components/ui/input';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { format } from 'date-fns';

const UserSearchContainer = ({
  setWantTOSearch,
  chatListData = [], // 👈 chat list pass korben
}: {
  setWantTOSearch: (val: boolean) => void;
  chatListData?: any[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [search] = useDebounce(searchText, 500);
  const updateSearchParams = useUpdateSearchParams();

  // ✅ Only search when text entered — default-e chatted users show
  const shouldSearch = search.trim().length > 0;

  const { data, isLoading, isFetching } = useGetAllUsersQuery(
    { page: 1, limit: 10, query: { searchTerm: search } },
    { skip: !shouldSearch }, // ✅ search na hole API call hobe na
  );

  const searchedUsers = data?.data || [];

  // ✅ Already chatted users — chatListData theke
  const chattedUsers = chatListData.map((chat: any) => ({
    _id: chat?.chat?.participants?.[0]?._id,
    firstName: chat?.chat?.participants?.[0]?.fullName,
    image: chat?.chat?.participants?.[0]?.image,
    lastMessage: chat?.message?.text || '',
    createdAt: chat?.chat?.participants?.[0]?.createdAt,
  }));

  const handleUserClick = (userId: string) => {
    updateSearchParams({ selectedUserId: userId });
    setWantTOSearch(false);
  };

  // ✅ Show searched users or chatted users
  const displayUsers = shouldSearch ? searchedUsers : chattedUsers;

  return (
    <div className="scroll-hide max-h-[80vh] min-h-[70vh] space-y-3 overflow-auto bg-primary-blue/10 px-2 rounded-lg">
      {/* Search input */}
      <div className="relative">
        <Input
          placeholder="Search People..."
          className="w-full rounded-sm border bg-transparent px-2 py-5 mt-2 border-gray-300"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-500 rounded-full p-1 cursor-pointer z-10"
          onClick={() => setWantTOSearch(false)}
        >
          <X color="#fff" size={12} />
        </div>
      </div>

      {/* Label */}
      <p className="text-xs text-gray-400 px-1">
        {shouldSearch
          ? `Search results for "${search}"`
          : 'Recent conversations'}
      </p>

      {/* Loading */}
      {(isLoading || isFetching) && shouldSearch ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex gap-x-2 items-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div className="space-y-2">
                <div className="w-40 h-4 bg-gray-300 rounded" />
                <div className="w-24 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : displayUsers.length ? (
        displayUsers.map((user: any) => (
          <div
            key={user._id}
            className="flex gap-x-3 items-center cursor-pointer rounded-md p-2 hover:bg-gray-100 transition-colors"
            onClick={() => handleUserClick(user._id)}
          >
            <CustomAvatar
              img={user.image}
              name={user.firstName}
              className="size-12"
            />
            <div className="flex flex-col">
              <p className="text-base font-medium text-gray-900 truncate max-w-[200px]">
                {user.firstName}
              </p>
              {/* last message or join date */}
              {shouldSearch ? (
                user.createdAt && (
                  <span className="text-sm text-gray-500">
                    Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </span>
                )
              ) : (
                <span className="text-sm text-gray-500 truncate max-w-[180px]">
                  {user.lastMessage || 'Start a conversation'}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <Empty message={shouldSearch ? 'No user found' : 'No recent chats'} />
      )}
    </div>
  );
};

export default UserSearchContainer;
