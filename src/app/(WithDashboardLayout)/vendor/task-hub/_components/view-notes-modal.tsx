'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { TNote } from '@/types/task.type';

type TProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notes: TNote[];
  taskTitle: string;
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

const ViewNotesModal = ({ isOpen, onOpenChange, notes, taskTitle }: TProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Notes — {taskTitle}</DialogTitle>
        </DialogHeader>

        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No notes yet</p>
        ) : (
          <div className="space-y-3 py-2">
            {notes.map((note, index) => {
              const style = statusStyleMap[note.status] || {
                text: 'text-gray-600',
                bg: 'bg-gray-100',
                dot: 'bg-gray-400',
                border: 'border-gray-200',
              };
              return (
                <div key={index} className="flex gap-3">
                  {/* left timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${style.dot}`}
                    />
                    {index !== notes.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>

                  {/* content */}
                  <div className="pb-4 flex-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mb-1.5 ${style.text} ${style.bg} ${style.border}`}
                    >
                      {note.status}
                    </span>
                    <p className="text-sm text-gray-700">{note.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(
                        new Date(note.createdAt),
                        'dd MMM, yyyy · hh:mm a',
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotesModal;
