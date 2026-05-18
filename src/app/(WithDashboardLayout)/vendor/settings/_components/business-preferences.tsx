'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useChooseOfferMutation,
  useGetVendorProfileQuery,
} from '@/redux/features/vendor/vendorApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const BusinessPreferences = () => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [preference, setPreference] = useState<string>('both');
  const [pendingPreference, setPendingPreference] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useGetVendorProfileQuery(user?.email as string);
  const vendor = data?.data;
  const vendorId = vendor?._id as string;

  useEffect(() => {
    if (vendor?.chooseOffer) {
      setPreference(vendor.chooseOffer);
    }
  }, [vendor]);

  const [chooseOffer] = useChooseOfferMutation();

  // ✅ Checkbox click modal open
  const handleChange = (value: string) => {
    setPendingPreference(value);
    setIsModalOpen(true);
  };

  // ✅ Modal confirm update
  const handleConfirm = async () => {
    if (!pendingPreference) return;
    const toastId = toast.loading('Updating business preference...');
    try {
      await chooseOffer({
        id: vendorId,
        chooseOffer: { chooseOffer: pendingPreference },
      }).unwrap();
      setPreference(pendingPreference);
      toast.success('Business preference updated successfully');
      router.push(`/vendor/manage-offering`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Update failed');
    } finally {
      toast.dismiss(toastId);
      setIsModalOpen(false);
      setPendingPreference(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingPreference(null);
  };

  const labels: Record<string, string> = {
    services: 'Services Only',
    both: 'Both Services & Products',
    products: 'Products Only',
  };

  return (
    <div className="mt-5">
      <h2 className="text-base font-medium text-gray-800 mb-3">
        Business Preferences
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <div className="flex items-center gap-3">
          <Checkbox
            id="services-only"
            checked={preference === 'services'}
            onCheckedChange={() => handleChange('services')}
          />
          <Label htmlFor="services-only">Services Only</Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="both"
            checked={preference === 'both'}
            onCheckedChange={() => handleChange('both')}
          />
          <Label htmlFor="both">Both Services & Products</Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="products-only"
            checked={preference === 'products'}
            onCheckedChange={() => handleChange('products')}
          />
          <Label htmlFor="products-only">Products Only</Label>
        </div>
      </div>

      {/* ✅ Confirm Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Business Preference</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to change your business preference to{' '}
            <span className="font-semibold text-gray-800">
              {pendingPreference ? labels[pendingPreference] : ''}
            </span>
            ?
          </p>
          <DialogFooter className="gap-2 mt-4">
            <Button
              className="rounded cursor-pointer"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-gradient-to-t to-green-800 from-green-500/70 text-white rounded cursor-pointer"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessPreferences;
