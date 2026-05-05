'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useChooseOfferMutation,
  useGetVendorProfileQuery,
} from '@/redux/features/vendor/vendorApi';
import { useRouter } from 'next/navigation';

const ChooseOffer = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const [selected, setSelected] = useState<string>('both');

  const { data } = useGetVendorProfileQuery(user?.email as string);
  const vendor = data?.data;
  const vendorId = vendor?._id as string;

  const options = [
    { key: 'services', label: 'List Services' },
    { key: 'both', label: 'List Both' },
    { key: 'products', label: 'List Products' },
  ];

  const [chooseOffer] = useChooseOfferMutation();

  const handleChooseOffer = async () => {
    const toastId = toast.loading('Choose Offering...');

    const updateChooseOffer = { chooseOffer: selected };

    console.log(updateChooseOffer);

    try {
      const res = await chooseOffer({
        id: vendorId,
        chooseOffer: updateChooseOffer,
      }).unwrap();
      console.log(res);
      toast.success(
        res.message ||
          'Thanks! Your offer choice has been recorded successfully.',
      );
      router.push('/pricing');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Status update failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${rectangleBgImg.src})`,
        backgroundSize: 'contain',
        width: '100%',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex justify-center items-center min-h-screen p-2"
    >
      <Card className=" rounded-2xl shadow-xl bg-white/90 backdrop-blur-md">
        <CardContent className="flex flex-col items-center justify-center">
          <div className="mb-5">
            <p className="text-sm text-gray-500">Choose any offer</p>
            <h2 className="text-lg font-semibold text-gray-800 mt-1">
              Service/Product Offering Selection
            </h2>
          </div>

          {/* Option buttons */}
          <div className="flex w-full justify-center gap-3">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                className={cn(
                  'px-8 py-5 rounded-md border cursor-pointer shadow-sm text-center',
                  selected === opt.key
                    ? 'bg-gradient-to-t to-green-800 from-green-600/70 text-white'
                    : 'bg-white hover:bg-gray-50',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Select Button */}
          <Button
            className="w-full mt-5 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-5 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
            onClick={handleChooseOffer}
          >
            SELECT <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChooseOffer;
