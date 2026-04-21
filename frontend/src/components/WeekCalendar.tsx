interface   WeekCalendarProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

const WeekCalendar = ({selectedDate, onDateChange}: WeekCalendarProps) =>{

    const toDateString = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };
    
    const parseLocalDate = (dateStr: string): Date => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
    };
    
    const GetWeekStart = (dateStr: string): Date =>  {
        const date = parseLocalDate(dateStr);
        const day = date.getDay();
        const diff = day == 0 ? -6: 1 - day;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        return monday;

    };

    const weekStart = GetWeekStart(selectedDate);

    const days = Array.from({length: 7}, (_, i) =>{
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    
    

    const today = toDateString(new Date());

    const getToPrevWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(weekStart.getDate() - 7);
        onDateChange(toDateString(prev));
    };

    const goToNextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(weekStart.getDate() + 7);
        onDateChange(toDateString(next));
    }

    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
    <div className="week-calendar">
      <div className="week-calendar-header">
        <button className="week-nav-btn" onClick={getToPrevWeek}>&#8249;</button>
        <span className="week-label">
          {days[0].toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </span>
        <button className="week-nav-btn" onClick={goToNextWeek}>&#8250;</button>
      </div>
 
      <div className="week-calendar-days">
        {days.map((day, i) => {
          const dateStr = toDateString(day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
 
          return (
            <div
              key={dateStr}
              className={`week-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
              onClick={() => {
                    console.log("clicked date:", dateStr);
                    onDateChange(dateStr);
                }}
            >
              <span className="week-day-label">{dayLabels[i]}</span>
              <span className="week-day-number">{day.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
 
export default WeekCalendar;

