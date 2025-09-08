'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TPaymentType } from '@/types/booking.type';
import { ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  price: number;
  onConfirm: (paymentType: TPaymentType) => void;
}

export function PaymentModal({ price, onConfirm }: PaymentModalProps) {
  const [selected, setSelected] = useState<TPaymentType>('full');

  const handleContinue = () => {
    onConfirm(selected);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 text-base">
          Continue <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold">
            Payment Process
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center space-x-3 my-3">
          {/* Pay Half */}
          <OptionCard
            label="Pay Half"
            amount={`$${(price / 2).toFixed(2)}`}
            selected={selected === 'half'}
            onClick={() => setSelected('half')}
          />

          {/* Pay Full */}
          <OptionCard
            label="Pay Full"
            amount={`$${price.toFixed(2)}`}
            selected={selected === 'full'}
            onClick={() => setSelected('full')}
          />

          {/* Pay Later */}
          <OptionCard
            label="Pay Later"
            amount=""
            selected={selected === 'later'}
            onClick={() => setSelected('later')}
          />
        </div>

        <Button
          onClick={handleContinue}
          className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
        >
          Continue <ArrowRight />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable Option Card */
function OptionCard({
  label,
  amount,
  selected,
  onClick,
}: {
  label: string;
  amount?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-8 py-5 rounded-md border cursor-pointer shadow-sm text-center',
        selected
          ? 'bg-gradient-to-t to-green-800 from-green-600/70 text-white'
          : 'bg-white hover:bg-gray-50',
      )}
    >
      <p className="font-medium">{label}</p>
      {amount && <p className="text-sm">{amount}</p>}
    </div>
  );
}
