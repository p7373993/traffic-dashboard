import React, { memo, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateTimePickerProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const DateTimePicker = memo<DateTimePickerProps>(
  ({ currentDate, setCurrentDate }) => {
    const changeDate = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + amount);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const changeHour = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        newDate.setHours(newDate.getHours() + amount);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const changeMinute = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        let newMinutes = newDate.getMinutes() + amount;
        if (newMinutes < 0) {
          newMinutes = 55;
          newDate.setHours(newDate.getHours() - 1);
        }
        if (newMinutes > 59) {
          newMinutes = 0;
          newDate.setHours(newDate.getHours() + 1);
        }
        newDate.setMinutes(newMinutes);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const isToday = useMemo(() => {
      const today = new Date();
      return (
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    }, [currentDate]);

    const formatHour = (date: Date) =>
      date.getHours().toString().padStart(2, "0");
    const formatMinute = (date: Date) => {
      const minutes = date.getMinutes();
      return (Math.floor(minutes / 5) * 5).toString().padStart(2, "0");
    };

    return (
      <div className="flex items-center justify-between border border-gray-300 rounded-md p-1 bg-white text-sm">
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => changeDate(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-20 text-center">
            {isToday
              ? "Today"
              : currentDate.toLocaleDateString("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                })}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center flex-1 border-l border-r border-gray-300">
          <button
            onClick={() => changeHour(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-12 text-center">
            {formatHour(currentDate)}
          </span>
          <button
            onClick={() => changeHour(1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => changeMinute(-5)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-12 text-center">
            {formatMinute(currentDate)}
          </span>
          <button
            onClick={() => changeMinute(5)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
