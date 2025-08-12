'use client';

import React, {useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  setYear,
  setMonth,
  getYear,
  startOfYear,
  addYears,
  subYears,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

interface DayData {
  income: number;
  expenses: number;
}

interface CalendarProps {
  variant?: 'picker' | 'display' | 'week'; // Variant se layout control hoga
  value?: Date | null;
  onChange?: (date: Date) => void; // Selected date parent ko batane ke liye
  onMonthChange?: (date: Date) => void; // Month/year change parent ko batane ke liye
  transactions?: Transaction[];
}

type CalendarView = 'days' | 'months' | 'years';

const Calendar: React.FC<CalendarProps> = ({
  variant = 'picker',
  value = new Date(),
  onChange,
  onMonthChange,
  transactions = [],
}) => {
  const [view, setView] = useState<CalendarView>('days');
  const [viewDate, setViewDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value);

  const monthlyData = useMemo(() => {
    if (variant === 'picker') return new Map();
    const data = new Map<string, DayData>();
    transactions.forEach(t => {
      const dayKey = format(parseISO(t.date), 'yyyy-MM-dd');
      if (!data.has(dayKey)) {
        data.set(dayKey, { income: 0, expenses: 0 });
      }
      const dayData = data.get(dayKey)!;
      if (t.type === 'income') dayData.income += t.amount;
      else dayData.expenses += t.amount;
    });
    return data;
  }, [transactions, variant]);

  const handleDateSelect = (day: Date) => {
    // ACTION: Added console.log for debugging
    console.log('Date selected inside Calendar component:', day);
    
    setSelectedDate(day);
    if (variant === 'week') {
      setViewDate(day);
    }
    if (onChange) {
      onChange(day);
    }
  };
  
  const handleViewDateChange = (newDate: Date) => {
      setViewDate(newDate);
      if (onMonthChange) {
          onMonthChange(newDate);
      }
  }

  const renderHeader = () => {
    let headerContent;
    let onHeaderClick: (() => void) | undefined;
    let onPrevClick;
    let onNextClick;

    switch (view) {
      case 'months':
        headerContent = format(viewDate, 'yyyy');
        onHeaderClick = () => setView('years');
        onPrevClick = () => handleViewDateChange(subYears(viewDate, 1));
        onNextClick = () => handleViewDateChange(addYears(viewDate, 1));
        break;
      case 'years':
        const start = getYear(viewDate) - 5;
        const end = getYear(viewDate) + 6;
        headerContent = `${start} - ${end}`;
        onPrevClick = () => handleViewDateChange(subYears(viewDate, 12));
        onNextClick = () => handleViewDateChange(addYears(viewDate, 12));
        break;
      default: // 'days'
        headerContent = format(viewDate, 'MMMM yyyy');
        onHeaderClick = () => setView('months');
        onPrevClick = () => handleViewDateChange(variant === 'week' ? subWeeks(viewDate, 1) : subMonths(viewDate, 1));
        onNextClick = () => handleViewDateChange(variant === 'week' ? addWeeks(viewDate, 1) : addMonths(viewDate, 1));
        break;
    }

    return (
      <div className="flex items-center justify-between py-2 px-2">
        <button type="button" onClick={onPrevClick} className="p-2 rounded-md text-neutral-grey3 hover:bg-neutral-dark2/50 dark:hover:bg-neutral-grey1 focus:outline-none">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={onHeaderClick} disabled={!onHeaderClick} className="text-lg font-heading font-semibold text-neutral-dark1 dark:text-neutral-white hover:text-system-blue disabled:hover:text-current disabled:cursor-default">
          {headerContent}
        </button>
        <button type="button" onClick={onNextClick} className="p-2 rounded-md text-neutral-grey3 hover:bg-neutral-dark2/50 dark:hover:bg-neutral-grey1 focus:outline-none">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDaysView = () => {
    const monthStart = startOfMonth(viewDate);
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    const isWeekView = variant === 'week';
    const startDate = isWeekView ? weekStart : startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = isWeekView ? endOfWeek(weekStart, { weekStartsOn: 1 }) : endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
    
    const rows = [];
    let days = [];
    let day = startDate;

    const weekdays = Array.from({ length: 7 }).map((_, i) => (
      <div className="text-center font-medium text-sm text-neutral-grey3 py-2" key={i}>
        {format(addDays(startDate, i), 'E')}
      </div>
    ));

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayKey = format(cloneDay, 'yyyy-MM-dd');
        const dayData = monthlyData.get(dayKey);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
            <button
            type="button"
            disabled={!isWeekView && !isCurrentMonth}
            className={`relative p-2 h-12 w-full flex flex-col items-center justify-center rounded-lg transition-colors duration-200 group disabled:cursor-not-allowed ${
              !isCurrentMonth && !isWeekView ? 'text-neutral-grey2' : 'text-neutral-dark1 dark:text-neutral-white'
            } ${isSelected ? 'bg-primary-brand text-neutral-dark1 font-bold' : 'hover:bg-neutral-softGrey2 dark:hover:bg-neutral-dark1'}`}
            key={day.toString()}
            onClick={() => handleDateSelect(cloneDay)}
            >
            <span className="text-sm">{format(day, 'd')}</span>
            {(variant === 'display' || variant === 'week') && dayData && (
              <div className="flex flex-row space-x-0.5 mt-0.5 items-center justify-center">
              {dayData.income > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-greenLight inline-block align-middle" ></span>
              )}
              {dayData.expenses < 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-redLight inline-block align-middle" ></span>
              )}
              </div>
            )}
            </button>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="p-2 space-y-1"><div className="grid grid-cols-7">{weekdays}</div>{rows}</div>;
  };

  const renderMonthsView = () => {
    const months = [];
    const monthStart = startOfYear(viewDate);
    for (let i = 0; i < 12; i++) {
      const month = addMonths(monthStart, i);
      months.push(
        <button
          type="button"
          key={i}
          onClick={() => {
            handleViewDateChange(month);
            setView('days');
          }}
          className={`p-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            isSameMonth(month, viewDate)
              ? 'bg-primary-brand text-white'
              : 'hover:bg-neutral-softGrey2 dark:hover:bg-neutral-dark1 text-neutral-dark1 dark:text-neutral-white'
          }`}
        >
          {format(month, 'MMM')}
        </button>
      );
    }
    return <div className="p-4 grid grid-cols-4 gap-2">{months}</div>;
  };

  const renderYearsView = () => {
    const years = [];
    const yearStart = getYear(viewDate) - 5;
    for (let i = 0; i < 12; i++) {
      const year = yearStart + i;
      years.push(
        <button
          type="button"
          key={year}
          onClick={() => {
            handleViewDateChange(setYear(viewDate, year));
            setView('months');
          }}
          className={`p-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            getYear(viewDate) === year
              ? 'bg-primary-brand text-white'
              : 'hover:bg-neutral-softGrey2 dark:hover:bg-neutral-dark1 text-neutral-dark1 dark:text-neutral-white'
          }`}
        >
          {year}
        </button>
      );
    }
    return <div className="p-4 grid grid-cols-4 gap-2">{years}</div>;
  };

  return (
    <div className="bg-neutral-white dark:bg-neutral-dark2 rounded-lg shadow-md w-full max-w-sm">
      {renderHeader()}
      {view === 'days' && renderDaysView()}
      {view === 'months' && renderMonthsView()}
      {view === 'years' && renderYearsView()}
    </div>
  );
};

export default Calendar;
