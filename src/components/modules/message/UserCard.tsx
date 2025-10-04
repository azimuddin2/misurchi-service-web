import CustomAvatar from '@/components/shared/custom-avater';
import { cn } from '@/lib/utils';
import { calculateTime } from '@/utils/calculateTime';
import { useRouter } from 'next/navigation';

const UserCard = ({
  user,
  setChatId,
  selectedUserId,
}: {
  user: any;
  setChatId?: any;
  selectedUserId?: string;
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        `flex items-center xl:gap-x-2 lg:gap-x-1 gap-x-2 cursor-pointer  px-1`,
        selectedUserId == user?.userData?._id &&
          'bg-primary-blue py-2 rounded text-white',
      )}
      onClick={() => {
        router.push(`message?selectedUserId=${user?.userData?._id}`);
        setChatId(user?.message?.chat);
      }}
    >
      <div>
        <CustomAvatar
          img={user?.userData?.image}
          name={user?.userData?.name}
          className="lg:size-8 size-10 xl:size-12  rounded-full "
        ></CustomAvatar>
      </div>

      <div className="flex-grow ">
        <div className="flex items-center justify-between gap-x-2">
          <h4
            className={cn(
              'lg:text-[14px] text-base xl:text-base  font-medium text-primary-black truncate lg:max-w-[150px] xl:max-w-[120px] 2xl:max-w-[180px]',
              selectedUserId == user?.userData?._id && 'text-white',
            )}
          >
            {user?.userData?.name}
          </h4>
          <p
            className={cn(
              'font-semibold text-secondary-2 text-primary-gray truncate text-[12px] lg:text-[10px] xl:text-[12px]',
              selectedUserId == user?.userData?._id && 'text-gray-200',
            )}
          >
            {calculateTime(user?.message?.createdAt)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p
            className={cn(
              'text-ellipsis text-[12px]  xl:text-[12px] lg:text-[10px]',
              user?.unseen && 'font-bold',
            )}
          >
            {user?.message?.text && user?.message?.text?.length > 34
              ? user?.message?.text?.slice(0, 34) + '...'
              : user?.message?.text || ''}

            {!user?.message?.text &&
              user?.message?.imageUrl?.length > 0 &&
              user?.message?.imageUrl?.length +
                ' ' +
                (user?.message?.imageUrl?.length > 1 ? 'Images' : 'Image')}
          </p>
          {/* unseen message */}
          <p
            className={cn(
              'text-[10px] px-1 bg-primary-blue rounded-full text-white',
              selectedUserId == user?.userData?._id && 'hidden',
            )}
          >
            {user?.unseenMessage ? user?.unseenMessage : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
