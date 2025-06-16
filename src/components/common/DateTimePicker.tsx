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
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "40px",
          padding: 0,
          background: "#FFF",
          alignItems: "flex-start",
          gap: "0px",
          flexShrink: 0,
        }}
      >
        {/* 날짜 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid #EDEDED",
            borderBottom: "1px solid #EDEDED",
            background: "#FFF",
            width: "33.33%",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-center w-full h-full gap-1">
            <button
              onClick={() => changeDate(-1)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#60;
            </button>
            <span className="mx-2 font-semibold">
              {isToday
                ? "Today"
                : currentDate.toLocaleDateString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
            </span>
            <button
              onClick={() => changeDate(1)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#62;
            </button>
          </div>
        </div>
        {/* 시 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid #EDEDED",
            borderBottom: "1px solid #EDEDED",
            borderLeft: "1px solid #EDEDED",
            background: "#FFF",
            width: "33.33%",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-center w-full h-full gap-1">
            <button
              onClick={() => changeHour(-1)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#60;
            </button>
            <span className="mx-2 font-semibold">
              {formatHour(currentDate)}
            </span>
            <button
              onClick={() => changeHour(1)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#62;
            </button>
          </div>
        </div>
        {/* 분 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid #EDEDED",
            borderBottom: "1px solid #EDEDED",
            borderLeft: "1px solid #EDEDED",
            background: "#FFF",
            width: "33.33%",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-center w-full h-full gap-1">
            <button
              onClick={() => changeMinute(-5)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#60;
            </button>
            <span className="mx-2 font-semibold">
              {formatMinute(currentDate)}
            </span>
            <button
              onClick={() => changeMinute(5)}
              className="px-1 text-gray-500 hover:text-blue-600"
            >
              &#62;
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
