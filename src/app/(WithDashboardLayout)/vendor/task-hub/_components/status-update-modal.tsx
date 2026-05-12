'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type TProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingStatus: { taskId: string; status: string } | null;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
};

const statusStyleMap: Record<
  string,
  { text: string; bg: string; dot: string; border: string }
> = {
  'To-Do': {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: 'bg-amber-400',
    border: 'border-amber-200',
  },
  'In Progress': {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
  },
  'Needs Review': {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    dot: 'bg-rose-500',
    border: 'border-rose-200',
  },
  'Blocked/Dependencies': {
    text: 'text-orange-800',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500',
    border: 'border-orange-200',
  },
  Done: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
  Obsolete: {
    text: 'text-slate-500',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
    border: 'border-slate-200',
  },
};

const StatusUpdateModal = ({
  isOpen,
  onOpenChange,
  pendingStatus,
  note,
  onNoteChange,
  onConfirm,
}: TProps) => {
  const style = pendingStatus
    ? statusStyleMap[pendingStatus.status] || {
        text: 'text-gray-600',
        bg: 'bg-gray-100',
        dot: 'bg-gray-400',
        border: 'border-gray-200',
      }
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Task Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status badge preview */}
          {pendingStatus && style && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 border border-gray-100 text-sm">
              <span className="text-xs text-gray-400">Changing to</span>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                />
                {pendingStatus.status}
              </span>
            </div>
          )}

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-500">Note</label>
            <Textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add a note about this status change..."
              rows={8}
              className="resize-none focus-visible:ring-green-500 focus-visible:ring-1 focus-visible:border-green-700 rounded"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-1/2 border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80 p-5 cursor-pointer text-sm uppercase shadow rounded-sm border-b-4 border-r-4 text-black"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-1/2 uppercase border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4"
            onClick={onConfirm}
          >
            Confirm update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
