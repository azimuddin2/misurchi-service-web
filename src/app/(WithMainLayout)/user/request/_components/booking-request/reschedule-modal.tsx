'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TBooking } from '@/types/booking.type';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

interface CancelModalProps {
  selectedBooking: TBooking | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
}

const RescheduleModal = ({
  selectedBooking,
  isOpen,
  onOpenChange,
}: CancelModalProps) => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);

  const handleReschedule = () => {
    if (!selectedBooking?._id) {
      // optional: show toast if no booking is selected
      return;
    }

    // Close modal
    onOpenChange(false);

    // Navigate to reschedule page with booking ID
    router.push(`/user/request/${selectedBooking._id}`);
  };

  const handleMessageVendor = () => {
    const vendorUserId = (selectedBooking?.vendor?.userId as any)?._id;

    const serviceId = selectedBooking?.service._id;

    router.push(`/user/message?userId=${vendorUserId}&serviceId=${serviceId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-xl">
            Reschedule Your Service
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="mt-2 space-y-1">
                <span className="flex text-sm text-center">
                  We understand that plans change! Would you like to cancel or
                  reschedule your service?
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            onClick={handleReschedule}
            className="w-1/2 uppercase border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4"
          >
            Reschedule
          </Button>
          <Button
            type="button"
            className="w-1/2 border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80 p-5 cursor-pointer text-base shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 text-black uppercase"
            disabled={!user?.userId}
            onClick={handleMessageVendor}
          >
            Message Provider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
