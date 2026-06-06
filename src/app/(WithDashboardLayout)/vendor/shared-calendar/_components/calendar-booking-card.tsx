import { TBooking } from '@/types/booking.type';
import React from 'react';
import { getBookingStatusConfig } from './booking-status';
import {
  CalendarDays,
  Clock,
  Edit3,
  Mail,
  Phone,
  User2,
  UserPlus,
} from 'lucide-react';

const CalendarBookingCard = ({
  booking,
  onEdit,
  onAssign,
}: {
  booking: TBooking;
  onEdit: (b: TBooking) => void;
  onAssign: (b: TBooking) => void;
}) => {
  const st = getBookingStatusConfig(booking);

  return (
    <li
      className={`rounded-xl border border-l-4 ${st.border} bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between`}
    >
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-sm text-gray-900 leading-snug">
            {booking.serviceName}
          </p>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-white text-[11px] font-medium tracking-wide ${st.color}`}
          >
            {st.label.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-700 text-sm flex items-center gap-1">
          <User2 size={13} className="text-gray-400" /> {booking.name}
        </p>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
          <Mail size={12} /> {booking.email}
        </p>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
          <Phone size={12} /> {booking.phone}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {booking.time}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays size={12} /> {booking.date}
        </span>
      </div>

      <div className="flex justify-between items-center border-t pt-3 mt-auto">
        <p className="text-xs text-gray-500">
          {booking.assignedToMember ? (
            <>
              Assigned:{' '}
              <span className="font-medium text-gray-700">
                {booking.assignedToMember.firstName +
                  ' ' +
                  booking.assignedToMember.lastName}
              </span>
            </>
          ) : (
            <span className="text-gray-400 italic">Unassigned</span>
          )}
        </p>
        {booking.assignedToMember ? (
          <button
            onClick={() => onEdit(booking)}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            <Edit3 size={13} /> Edit
          </button>
        ) : (
          <button
            onClick={() => onAssign(booking)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            <UserPlus size={13} /> Assign
          </button>
        )}
      </div>
    </li>
  );
};

export default CalendarBookingCard;
