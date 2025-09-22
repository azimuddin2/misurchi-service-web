'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';

export function VendorApprovalModal({
  orderId,
  requestType,
  vendorApproved,
}: any) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleConfirm = async () => {
    if (!action) return;
    // try {
    //   const res = await updateOrderRequestStatus({
    //     orderId,
    //     vendorApproved: action === "approve",
    //   }).unwrap();

    //   toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
    //   setOpen(false);
    //   setAction(null);
    // } catch (err: any) {
    //   toast.error(err?.data?.message || "Failed to update request");
    // }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Approve Button */}
      <Button
        size="sm"
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50 rounded"
        disabled={vendorApproved === true}
        onClick={() => {
          setAction('approve');
          setOpen(true);
        }}
      >
        Approve
      </Button>

      {/* Reject Button */}
      <Button
        size="sm"
        variant="outline"
        className="border-red-500 text-red-600 hover:bg-red-50 rounded"
        disabled={vendorApproved === false}
        onClick={() => {
          setAction('reject');
          setOpen(true);
        }}
      >
        Reject
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{' '}
              <span className="font-semibold">
                {action === 'approve' ? 'approve' : 'reject'}
              </span>{' '}
              this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={action === 'approve' ? 'bg-green-600' : 'bg-red-600'}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
