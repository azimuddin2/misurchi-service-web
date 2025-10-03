'use client';

import CustomAvatar from '@/components/shared/CustomAvater';
import Empty from '@/components/shared/Empty';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetAllUserQuery } from '@/redux/api/authApi';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

const UserSearchContainer = ({ setWantTOSearch }: any) => {
  const [limit, setLimit] = useState(6);
  const [searchText, setSearchText] = useState('');
  const [search] = useDebounce(searchText, 1000);
  const query: Record<string, string | number> = {};
  query['limit'] = limit;
  if (search) {
    query['searchTerm'] = search;
  }
  const { data, isLoading } = useGetAllUserQuery(query);
  const router = useRouter();

  return (
    <div className="scroll-hide max-h-[80vh] min-h-[70vh] space-y-5 overflow-auto bg-primary-blue/10 px-2 rounded-lg">
      <div className="relative">
        <Input
          placeholder="Search People...."
          className="w-full rounded-xl border bg-transparent px-2 py-6 mt-2 border-black"
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
      ) : data?.data?.data?.length ? (
        data?.data?.data?.map((user: any) => (
          <div
            key={user?._id}
            className="flex gap-x-1 items-center cursor-pointer"
            onClick={() => router.push(`/message?selectedUserId=${user?._id}`)}
          >
            <CustomAvatar
              img={user?.image}
              name={user?.name}
              className="size-14"
            />
            <div>
              <p className="text-xl font-medium">
                {user?.name?.length > 16
                  ? user?.name.slice(0, 16) + '...'
                  : user?.name}
              </p>
              <p>
                {user?.title?.length > 20
                  ? user?.title.slice(0, 20) + '...'
                  : user?.title}
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
          limit >= data?.data?.meta?.total && 'hidden',
        )}
      >
        <Button
          className="bg-primary-blue rounded-full mb-5"
          onClick={() => setLimit((prev) => prev + 6)}
          disabled={limit >= data?.data?.meta?.total || isLoading}
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default UserSearchContainer;
