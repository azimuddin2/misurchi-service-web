'use client';

import { useState, useMemo } from 'react';
import { TBooking } from '@/types/booking.type';
import { useGetBookingAppointmentsQuery } from '@/redux/features/booking/bookingApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/shared/Spinner';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
  List,
} from 'lucide-react';
import Image from 'next/image';
import EditAssignModal from './edit-assign-modal';
import AddAssignModal from './add-assign-modal';
import {
  CALENDAR_STATUS_CONFIG,
  getBookingStatusConfig,
} from './booking-status';
import CalendarBookingCard from './calendar-booking-card';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = 'day' | 'week' | 'month';

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND = Object.values(CALENDAR_STATUS_CONFIG).map((c) => ({
  label: c.label,
  dot: c.dot,
}));

// ─── Date utilities ───────────────────────────────────────────────────────────
function toYMD(date: Date) {
  return date.toLocaleDateString('en-CA');
}

function getWeekDays(date: Date): Date[] {
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function getMonthDays(date: Date): (Date | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatPeriodLabel(date: Date, view: ViewMode) {
  if (view === 'day') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (view === 'week') {
    const days = getWeekDays(date);
    const start = days[0].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = days[6].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} – ${end}`;
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const SharedCalendar = () => {
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.vendorId as string;

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isAddAssignModalOpen, setAddAssignModalOpen] = useState(false);
  const [isEditAssignModalOpen, setEditAssignModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<TBooking | null>(null);

  const formattedDate = toYMD(currentDate);

  const { data, isLoading, isError, refetch } = useGetBookingAppointmentsQuery({
    vendorId,
    query: { date: formattedDate },
  });

  const bookings: TBooking[] = data?.data ?? [];

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, TBooking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    });
    return map;
  }, [bookings]);

  function navigate(dir: 1 | -1) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') d.setDate(d.getDate() + dir);
      else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
      else d.setMonth(d.getMonth() + dir);
      return d;
    });
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  function handleEdit(b: TBooking) {
    setBookingData(b);
    setEditAssignModalOpen(true);
  }

  function handleAssign(b: TBooking) {
    setBookingData(b);
    setAddAssignModalOpen(true);
  }

  const visibleDates = useMemo(() => {
    if (viewMode === 'day') return [toYMD(currentDate)];
    if (viewMode === 'week') return getWeekDays(currentDate).map(toYMD);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) =>
      toYMD(new Date(year, month, i + 1)),
    );
  }, [viewMode, currentDate]);

  const visibleBookings = useMemo(() => {
    return visibleDates.flatMap((d) => bookingsByDate[d] ?? []);
  }, [visibleDates, bookingsByDate]);

  const today = toYMD(new Date());
  const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* ── Header / Controls ── */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-800 min-w-[180px] text-center">
              {formatPeriodLabel(currentDate, viewMode)}
            </span>
            <button
              onClick={() => navigate(1)}
              className="p-2 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={goToday}
              className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* View Tabs */}
          <div className="flex rounded-lg border overflow-hidden">
            {(['day', 'week', 'month'] as ViewMode[]).map((v) => {
              const icons = {
                day: <List size={14} />,
                week: <LayoutGrid size={14} />,
                month: <CalendarDays size={14} />,
              };
              return (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium capitalize transition-colors cursor-pointer ${
                    viewMode === v
                      ? 'bg-gradient-to-t to-green-800 from-green-600/70 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-l'
                  }`}
                >
                  {icons[v]} {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend — auto-generated from CALENDAR_STATUS_CONFIG */}
        <div className="flex flex-wrap gap-4">
          {LEGEND.map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-1.5 text-xs text-gray-500"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar Grid ── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* MONTH VIEW */}
        {viewMode === 'month' && (
          <>
            <div className="grid grid-cols-7 border-b bg-gray-50">
              {DOW_LABELS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {getMonthDays(currentDate).map((date, idx) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[90px] border-r border-b bg-gray-50/60"
                    />
                  );
                }
                const ds = toYMD(date);
                const dayBookings = bookingsByDate[ds] ?? [];
                const isToday = ds === today;
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                return (
                  <div
                    key={ds}
                    onClick={() => {
                      setCurrentDate(date);
                      setViewMode('day');
                    }}
                    className={`min-h-[90px] border-r border-b p-1.5 cursor-pointer transition-colors hover:bg-green-50/40 ${
                      !isCurrentMonth ? 'opacity-40' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${
                        isToday ? 'bg-green-700 text-white' : 'text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    {dayBookings.slice(0, 2).map((b) => {
                      // ✅ Uses booking-status.ts logic
                      const st = getBookingStatusConfig(b);
                      return (
                        <div
                          key={b._id}
                          className={`text-[10px] rounded px-1 py-0.5 mb-0.5 truncate font-medium ${st.bg} ${st.text}`}
                        >
                          {b.time} {b.serviceName}
                        </div>
                      );
                    })}
                    {dayBookings.length > 2 && (
                      <div className="text-[10px] text-gray-400 pl-1">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* WEEK VIEW */}
        {viewMode === 'week' && (
          <>
            <div className="grid grid-cols-7 border-b bg-gray-50">
              {getWeekDays(currentDate).map((d) => {
                const ds = toYMD(d);
                const isToday = ds === today;
                return (
                  <div
                    key={ds}
                    className="py-3 text-center border-r last:border-r-0 cursor-pointer hover:bg-green-50/40"
                    onClick={() => {
                      setCurrentDate(d);
                      setViewMode('day');
                    }}
                  >
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      {DOW_LABELS[d.getDay()]}
                    </div>
                    <div
                      className={`mx-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        isToday ? 'bg-green-700 text-white' : 'text-gray-800'
                      }`}
                    >
                      {d.getDate()}
                    </div>
                    {/* ✅ Dot indicators using booking-status.ts */}
                    <div className="flex justify-center gap-0.5 mt-1 h-2">
                      {(bookingsByDate[ds] ?? []).slice(0, 4).map((b) => {
                        const st = getBookingStatusConfig(b);
                        return (
                          <span
                            key={b._id}
                            className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 divide-x min-h-[200px]">
              {getWeekDays(currentDate).map((d) => {
                const ds = toYMD(d);
                const dayBookings = bookingsByDate[ds] ?? [];
                return (
                  <div key={ds} className="p-2 space-y-1">
                    {dayBookings.map((b) => {
                      // ✅ Uses booking-status.ts logic
                      const st = getBookingStatusConfig(b);
                      return (
                        <div
                          key={b._id}
                          className={`rounded-lg px-2 py-1.5 border-l-2 ${st.bg} ${st.text} ${st.border} text-[11px] cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <p className="font-semibold truncate">
                            {b.serviceName}
                          </p>
                          <p className="opacity-70">{b.time}</p>
                        </div>
                      );
                    })}
                    {dayBookings.length === 0 && (
                      <p className="text-[11px] text-gray-300 text-center pt-4">
                        —
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* DAY VIEW */}
        {viewMode === 'day' && (
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 text-sm">
                {bookings.length} appointment
                {bookings.length !== 1 ? 's' : ''}
              </h3>
            </div>
            {isLoading && (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            )}
            {isError && (
              <p className="text-red-500 text-center py-8">
                ❌ Failed to load bookings.
              </p>
            )}
            {!isLoading && !isError && bookings.length === 0 && (
              <div className="text-center py-10">
                <Image
                  src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  alt="No results"
                  width={80}
                  height={80}
                  className="mx-auto mb-3 opacity-50"
                />
                <p className="text-gray-400 text-sm">
                  No bookings for this day.
                </p>
              </div>
            )}
            {!isLoading && !isError && bookings.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((b) => (
                  <CalendarBookingCard
                    key={b._id}
                    booking={b}
                    onEdit={handleEdit}
                    onAssign={handleAssign}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ── Bookings List (Week/Month) ── */}
      {viewMode !== 'day' && (
        <div className="bg-white rounded-2xl border shadow-sm p-4 lg:p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Appointments · {formatPeriodLabel(currentDate, viewMode)}
          </h2>
          {isLoading && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}
          {isError && (
            <p className="text-red-500 text-center py-6">
              ❌ Failed to load bookings.
            </p>
          )}
          {!isLoading && !isError && visibleBookings.length === 0 && (
            <div className="text-center py-8">
              <Image
                src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                alt="No results"
                width={100}
                height={100}
                className="mx-auto mb-3 opacity-60"
              />
              <p className="text-gray-400 text-sm">No bookings found.</p>
            </div>
          )}
          {!isLoading && !isError && visibleBookings.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleBookings.map((b) => (
                <CalendarBookingCard
                  key={b._id}
                  booking={b}
                  onEdit={handleEdit}
                  onAssign={handleAssign}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <EditAssignModal
        isOpen={isEditAssignModalOpen}
        onOpenChange={setEditAssignModalOpen}
        refetch={refetch}
        bookingData={bookingData}
      />
      <AddAssignModal
        isOpen={isAddAssignModalOpen}
        onOpenChange={setAddAssignModalOpen}
        refetch={refetch}
        bookingData={bookingData}
      />
    </div>
  );
};

export default SharedCalendar;
