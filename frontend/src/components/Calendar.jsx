import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  isToday,
  startOfDay,
  setHours,
  setMinutes,
} from "date-fns";

export default function Calendar({ bookedDates = [], selectedDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const booked = bookedDates.map((date) => parseISO(date));
  const start = selectedDates.startDate ? parseISO(selectedDates.startDate) : null;
  const end = selectedDates.endDate ? parseISO(selectedDates.endDate) : null;

  const now = new Date();
  const today = startOfDay(now);
  const cutoffTime = setMinutes(setHours(today, 14), 0); // 2:00 PM

  const isInRange = (day) => {
    if (!start && !end) return false;
    if (start && !end) return isSameDay(day, start);
    if (!start && end) return isSameDay(day, end);

    return (
      (isAfter(day, start) || isSameDay(day, start)) &&
      (isBefore(day, end) || isSameDay(day, end))
    );
  };

  const isSelectable = (day) => {
    // Past dates
    if (isBefore(day, today)) return false;
    // Same-day after 2 PM
    if (isSameDay(day, today) && isAfter(now, cutoffTime)) return false;
    return true;
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="text-gray-600 hover:text-gray-800"
      >
        ⬅
      </button>
      <h2 className="text-xl font-semibold text-gray-800">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="text-gray-600 hover:text-gray-800"
      >
        ➡
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-700">
          {format(addDays(startOfWeek(date), i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isBookedNight = booked.some((d) => isSameDay(d, day));
        const inSelectedRange = isInRange(day);
        const todayFlag = isToday(day);
        const selectable = isSelectable(day);

        let style = "";
        if (!selectable) {
          style = "bg-gray-200 text-gray-400"; // past or today after 2 PM
        } else if (isBookedNight) {
          style = "bg-red-300 text-red-900"; // booked nights
        } else if (inSelectedRange) {
          style = "bg-blue-300 text-blue-900"; // selected range
        } else if (isSameMonth(day, monthStart)) {
          style = "bg-green-100 text-green-800"; // current month
        } else {
          style = "bg-gray-100 text-gray-400"; // other month
        }

        days.push(
          <div
            key={day}
            className={`p-2 text-center border rounded ${style} ${
              todayFlag ? "border-2 border-black" : ""
            }`}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
