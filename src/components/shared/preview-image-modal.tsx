import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';

const PreviewImageModal = ({ open, setOpen, url, className }: any) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('bg-white border-none outline-none', className)}
        // @ts-ignore
        showDialogClose={false}
      >
        <div>
          <Avatar className="w-full h-full rounded-lg">
            <AvatarImage src={url} className="w-full rounded-xl mt-5" />
            <AvatarFallback className=" rounded-none">
              <Skeleton className="h-full w-full bg-[#e69191]"></Skeleton>
            </AvatarFallback>
          </Avatar>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewImageModal;
