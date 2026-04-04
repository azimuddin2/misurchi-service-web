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
        <Button className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 text-base">
          Continue <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-base sm:text-lg">
            Payment Process
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3">
          <OptionCard
            label="Pay Half"
            amount={`$${(price / 2).toFixed(2)}`}
            selected={selected === 'half'}
            onClick={() => setSelected('half')}
          />
          <OptionCard
            label="Pay Full"
            amount={`$${price.toFixed(2)}`}
            selected={selected === 'full'}
            onClick={() => setSelected('full')}
          />
          <OptionCard
            label="Pay Later"
            amount=""
            selected={selected === 'later'}
            onClick={() => setSelected('later')}
          />
        </div>

        <Button
          onClick={handleContinue}
          className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-5 cursor-pointer text-sm mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
        >
          Continue <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

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
        'w-full py-4 sm:py-5 px-2 sm:px-4 rounded-md border cursor-pointer shadow-sm text-center transition-all duration-150',
        selected
          ? 'bg-gradient-to-t to-green-800 from-green-600/70 text-white border-green-700'
          : 'bg-white hover:bg-gray-50 border-gray-200',
      )}
    >
      <p className="font-medium text-xs sm:text-sm leading-tight">{label}</p>
      {amount && (
        <p className="text-xs sm:text-sm mt-0.5 opacity-90">{amount}</p>
      )}
    </div>
  );
}
