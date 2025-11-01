'use client';

import CustomAvatar from '@/components/shared/custom-avatar';
import Empty from '@/components/shared/empty';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';
import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { format } from 'date-fns';

const UserSearchContainer = ({ setWantTOSearch }: any) => {
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [search] = useDebounce(searchText, 500); // debounce search input
  const updateSearchParams = useUpdateSearchParams();

  // ✅ Call API with search, page & limit
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page,
    limit,
    query: search ? { searchTerm: search } : undefined,
  });

  const users = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  // ✅ Reset page when search changes
  useEffect(() => {
    setPage(1);
    setLimit(6);
  }, [search]);

  // ✅ Load more handler
  const handleLoadMore = () => {
    if (page < meta.totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  // ✅ Handle user click (open inbox + close search)
  const handleUserClick = (userId: string) => {
    updateSearchParams({ selectedUserId: userId });
    setWantTOSearch(false); // close search container
  };

  return (
    <div className="scroll-hide max-h-[80vh] min-h-[70vh] space-y-5 overflow-auto bg-primary-blue/10 px-2 rounded-lg">
      {/* Search input */}
      <div className="relative">
        <Input
          placeholder="Search People..."
          className="w-full rounded-sm border bg-transparent px-2 py-2 mt-2 border-black"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-500 rounded-full p-1 cursor-pointer z-10"
          onClick={() => setWantTOSearch(false)}
        >
          <X color="#fff" size={20} />
        </div>
      </div>

      {/* Loading state */}
      {isLoading || isFetching ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="flex gap-x-2 items-center animate-pulse">
              <div className="w-14 h-14 rounded-full bg-gray-300"></div>
              <div className="space-y-2">
                <div className="w-40 h-4 bg-gray-300"></div>
                <div className="w-24 h-4 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length ? (
        // ✅ Users list
        users.map((user: IUser) => (
          <div
            key={user._id}
            className="flex gap-x-3 items-center cursor-pointer rounded-md p-2 hover:bg-gray-100 transition-colors"
            onClick={() => handleUserClick(user._id)} // ✅ fixed line
          >
            <CustomAvatar
              img={user.image}
              name={user.firstName}
              className="size-12"
            />

            <div className="flex flex-col">
              <p className="text-lg font-medium text-gray-900 truncate max-w-[200px]">
                {user.firstName}
              </p>
              {user.createdAt && (
                <span className="text-sm text-gray-500">
                  Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <Empty message="No user found" />
      )}

      {/* Load More Button */}
      {page < meta.totalPage && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="rounded-full px-6 py-2 mb-5 bg-primary-blue border border-green-600 cursor-pointer text-green-600 hover:bg-primary-blue/90 transition-colors flex items-center gap-2"
          >
            {isFetching ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Load More ({users.length}/{meta.totalPage || '?'})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserSearchContainer;
