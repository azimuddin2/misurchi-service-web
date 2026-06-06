import { TBooking } from '@/types/booking.type';

// ─── Calendar Status Config ───────────────────────────────────────────────────
export type CalendarStatus = 'orange' | 'green' | 'red' | 'grey';

export const CALENDAR_STATUS_CONFIG: Record<
  CalendarStatus,
  {
    label: string;
    color: string;
    dot: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  orange: {
    label: 'Scheduled (Unpaid)',
    color: 'bg-orange-500',
    dot: 'bg-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-l-orange-400',
  },
  green: {
    label: 'Confirmed (Paid)',
    color: 'bg-green-500',
    dot: 'bg-green-400',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-l-green-400',
  },
  red: {
    label: 'Cancelled',
    color: 'bg-red-500',
    dot: 'bg-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-l-red-400',
  },
  grey: {
    label: 'Rescheduled',
    color: 'bg-gray-400',
    dot: 'bg-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-l-gray-400',
  },
};

// ─── Core Logic ───────────────────────────────────────────────────────────────
// Priority order:
// 1. ⚫ Grey   → reschedule request approved by vendor
// 2. 🔴 Red    → cancelled status OR cancel request approved by vendor
// 3. 🟢 Green  → confirmed + fully paid
// 4. 🟠 Orange → everything else (pending, half-paid, ongoing, etc.)

export function getCalendarStatus(booking: TBooking): CalendarStatus {
  const { status, isPaid, request } = booking;
  const requestType = request?.type ?? 'none';
  const vendorApproved = request?.vendorApproved;

  // ⚫ Grey — reschedule approved
  if (requestType === 'reschedule' && vendorApproved === true) {
    return 'grey';
  }

  // 🔴 Red — cancelled status or cancel request approved
  if (
    status === 'cancelled' ||
    (requestType === 'cancel' && vendorApproved === true)
  ) {
    return 'red';
  }

  // 🟢 Green — confirmed and fully paid
  if (status === 'confirmed' && isPaid === true) {
    return 'green';
  }

  // 🟠 Orange — everything else
  return 'orange';
}

// ─── Helper to get full config ────────────────────────────────────────────────
export function getBookingStatusConfig(booking: TBooking) {
  const status = getCalendarStatus(booking);
  return CALENDAR_STATUS_CONFIG[status];
}
