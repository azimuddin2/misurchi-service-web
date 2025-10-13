'use client';

import CustomAvatar from '@/components/shared/custom-avater';
import Empty from '@/components/shared/empty';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { cn } from '@/lib/utils';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

const UserSearchContainer = ({ setWantTOSearch }: any) => {
  const [limit, setLimit] = useState(6);
  const [searchText, setSearchText] = useState('');
  const [search] = useDebounce(searchText, 1000);
  const query: Record<string, string | number> = {};
  const updateSearchParams = useUpdateSearchParams();

  const { data, isLoading } = useGetAllUsersQuery({});

  const users = data?.data || [];

  const meta = data?.meta || { totalPage: 1 };

  return (
    <div className="scroll-hide max-h-[80vh] min-h-[70vh] space-y-5 overflow-auto bg-primary-blue/10 px-2 rounded-lg">
      <div className="relative">
        <Input
          placeholder="Search People...."
          className="w-full rounded-sm border bg-transparent px-2 py-6 mt-2 border-black"
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

      {/* Skeleton loader for isLoading */}
      {isLoading ? (
        <div className="space-y-4">
          {/* Skeleton item */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex gap-x-2 items-center animate-pulse"
            >
              <div className="w-14 h-14 rounded-full bg-gray-300"></div>
              <div className="space-y-2">
                <div className="w-40 h-4 bg-gray-300"></div>
                <div className="w-24 h-4 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      ) : users?.length ? (
        users?.map((user: IUser) => (
          <div
            key={user?._id}
            className="flex gap-x-1 items-center cursor-pointer"
            onClick={() => updateSearchParams({ selectedUserId: user?._id })}
          >
            <CustomAvatar
              img={user?.image}
              name={user?.firstName}
              className="size-14"
            />
            <div>
              <p className="text-xl font-medium">
                {user?.firstName?.length > 16
                  ? user?.firstName.slice(0, 16) + '...'
                  : user?.firstName}
              </p>
              <p>
                {user?.firstName?.length > 20
                  ? user?.firstName.slice(0, 20) + '...'
                  : user?.firstName}
              </p>
            </div>
          </div>
        ))
      ) : (
        <Empty message="No user found"></Empty>
      )}

      <div
        className={cn(
          `flex justify-end`,
          isLoading && 'hidden',
          limit >= meta?.totalPage && 'hidden',
        )}
      >
        <Button
          className="bg-primary-blue rounded-full mb-5"
          onClick={() => setLimit((prev) => prev + 6)}
          disabled={limit >= meta?.totalPage || isLoading}
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default UserSearchContainer;
