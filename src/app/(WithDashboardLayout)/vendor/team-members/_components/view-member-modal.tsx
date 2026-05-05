'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TMember } from '@/types/member.type';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type Props = {
  selectedMember: TMember | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const roleConfig = {
  manager: {
    label: '💼 Manager',
    className: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  supervisor: {
    label: '🛡️ Supervisor',
    className: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  team_member: {
    label: '👤 Team Member',
    className: 'bg-green-50 text-green-800 border-green-200',
  },
};

const ViewMemberModal = ({ selectedMember, isOpen, onOpenChange }: Props) => {
  const router = useRouter();

  if (!selectedMember) return null;

  const role = roleConfig[selectedMember.role] ?? roleConfig.team_member;
  const fullName = `${selectedMember.firstName} ${selectedMember.lastName}`;
  const initials = `${selectedMember.firstName[0]}${selectedMember.lastName[0]}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <DialogTitle className="text-base font-medium capitalize">
            Team member details
          </DialogTitle>
        </DialogHeader>

        {/* Profile */}
        <div className="flex items-center gap-4 px-6 py-4 border-b">
          <Avatar className="w-14 h-14">
            <AvatarImage src={selectedMember.image} alt={fullName} />
            <AvatarFallback className="bg-green-100 text-green-800 font-medium text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-base">{fullName}</p>
            <p className="text-sm text-gray-500 mb-1">{selectedMember.email}</p>
            <Badge
              variant="outline"
              className={`text-xs rounded-full ${role.className}`}
            >
              {role.label}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2">
          {[
            { label: 'Phone', value: selectedMember.phone },
            { label: 'Speciality', value: selectedMember.speciality },
            { label: 'Time zone', value: selectedMember.timeZone },
            { label: 'Work hours', value: selectedMember.workHours },
            {
              label: 'Status',
              value: selectedMember.isDeleted ? 'Inactive' : 'Active',
              color: selectedMember.isDeleted
                ? 'text-red-500'
                : 'text-green-600',
            },
            {
              label: 'Joined',
              value: format(new Date(selectedMember.createdAt), 'dd MMM, yyyy'),
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`px-6 py-3 border-b ${i % 2 === 0 ? 'border-r' : ''}`}
            >
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p
                className={`text-base font-medium capitalize ${item.color ?? ''}`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Permissions */}
        {selectedMember.permissions &&
          selectedMember.permissions.length > 0 && (
            <div className="px-6 pt-5 py-4 border-b">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                Permissions
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMember.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200 capitalize"
                  >
                    {perm.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="flex justify-between gap-2 mt-8 px-5 pb-5">
          <Button
            type="button"
            className="w-1/2 border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80 p-5 cursor-pointer text-sm uppercase shadow rounded-sm border-b-4 border-r-4 text-black"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              router.push(
                `/vendor/team-members/update-member/${selectedMember._id}`,
              );
            }}
            className="w-1/2 uppercase border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4"
          >
            <span>Edit Member</span> <ArrowRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMemberModal;
