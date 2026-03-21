'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = 'Select date',
  showMonthYearPicker = false,
  showYearPicker = false,
  dateFormat = 'dd MMM yyyy',
  className = '' 
}) {
  const parsedDate = value ? new Date(value) : null;

  const handleChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}T00:00:00.000Z`;
      onChange(formatted);
    } else {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <DatePicker
        selected={parsedDate}
        onChange={handleChange}
        placeholderText={placeholder}
        showMonthYearPicker={showMonthYearPicker}
        showYearPicker={showYearPicker}
        dateFormat={dateFormat}
        isClearable
        showPopperArrow={false}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        calendarClassName="shadow-lg border border-slate-200 rounded-lg"
        popperProps={{
          strategy: 'fixed'
        }}
        portalId="date-picker-portal"
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  startPlaceholder = 'Start Date',
  endPlaceholder = 'End Date',
  className = '' 
}) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">{startPlaceholder}</label>
        <CustomDatePicker
          value={startDate}
          onChange={onStartDateChange}
          placeholder={startPlaceholder}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">{endPlaceholder}</label>
        <CustomDatePicker
          value={endDate}
          onChange={onEndDateChange}
          placeholder={endPlaceholder}
        />
      </div>
    </div>
  );
}
