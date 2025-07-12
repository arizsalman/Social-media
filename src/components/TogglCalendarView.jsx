import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Tooltip } from "primereact/tooltip";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./TogglCalendarView.css";
import { Calendar } from "primereact/calendar";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Replace the timeSlots array with 30-minute slots
const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = (i % 2) * 30;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const label = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
  return { hour, min, label };
});
const defaultColors = ["#4ecdc4", "#ff6b6b", "#feca57", "#45b7d1", "#96ceb4"];

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(1, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Mock events: each event has dayIdx (0=Mon), startHour, startMin, endHour, endMin, color, label
const mockEvents = [
  { dayIdx: 0, startHour: 9, startMin: 0, endHour: 11, endMin: 30, color: "#4ecdc4", label: "Design Review" },
  { dayIdx: 0, startHour: 14, startMin: 0, endHour: 15, endMin: 0, color: "#ff6b6b", label: "Client Call" },
  { dayIdx: 1, startHour: 10, startMin: 15, endHour: 12, endMin: 0, color: "#feca57", label: "Dev Sprint" },
  { dayIdx: 3, startHour: 16, startMin: 0, endHour: 18, endMin: 0, color: "#45b7d1", label: "UI Polish" },
  { dayIdx: 4, startHour: 8, startMin: 0, endHour: 9, endMin: 30, color: "#96ceb4", label: "Testing" },
];

const TogglCalendarView = () => {
  // Sidebar expand/collapse state
  const [goalsOpen, setGoalsOpen] = useState(() => {
    const saved = localStorage.getItem('goalsOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [favoritesOpen, setFavoritesOpen] = useState(true);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const intervalRef = useRef(null);

  // Timer-to-calendar dialog state
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [timerEventDay, setTimerEventDay] = useState(0);
  const [timerEventStart, setTimerEventStart] = useState(9);
  const [timerEventLabel, setTimerEventLabel] = useState("");
  const [timerEventColor, setTimerEventColor] = useState(defaultColors[0]);

  // Week navigation state
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const today = new Date();
  const weekNumber = getWeekNumber(weekStart);
  const weekLabel = isSameDay(getMonday(today), weekStart) ? `This week · W${weekNumber}` : `Week · W${weekNumber}`;
  const weekDates = daysOfWeek.map((_, idx) => addDays(weekStart, idx));

  // User events state
  const [userEvents, setUserEvents] = useState(() => {
    const saved = localStorage.getItem('userEvents');
    return saved ? JSON.parse(saved) : [];
  });
  const [addEvent, setAddEvent] = useState(null); // {dayIdx, startHour, endHour}
  const [eventLabel, setEventLabel] = useState("");
  const [eventColor, setEventColor] = useState(defaultColors[0]);
  const [eventRepeatWeekly, setEventRepeatWeekly] = useState(false);

  // Drag-to-select state
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null); // {dayIdx, hour}
  const [dragEnd, setDragEnd] = useState(null); // {dayIdx, hour}

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEventIdx, setEditEventIdx] = useState(null);
  const [editEventLabel, setEditEventLabel] = useState("");
  const [editEventColor, setEditEventColor] = useState(defaultColors[0]);
  const [editEventRepeatWeekly, setEditEventRepeatWeekly] = useState(false);

  // Add these state variables for minute selection in add/edit forms
  const [eventStartMin, setEventStartMin] = useState(0);
  const [eventEndMin, setEventEndMin] = useState(0);
  const [editEventStartMin, setEditEventStartMin] = useState(0);
  const [editEventEndMin, setEditEventEndMin] = useState(0);

  // Add new state for project, tags, notes, and billable
  const [eventProject, setEventProject] = useState("");
  const [eventTags, setEventTags] = useState([]);
  const [eventNote, setEventNote] = useState("");
  const [eventBillable, setEventBillable] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showBillableInput, setShowBillableInput] = useState(false);

  // Example project and tag options
  const projectOptions = ["Personal", "Work", "Fitness", "Study"];
  const tagOptions = ["urgent", "routine", "health", "focus"];

  // Add state for time pickers in edit modal
  const [editEventStartTime, setEditEventStartTime] = useState(null);
  const [editEventEndTime, setEditEventEndTime] = useState(null);

  // Add a ref for each cell to get its bounding rect
  const cellRefs = useRef({});

  // Goals state
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [newGoal, setNewGoal] = useState("");

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [newFavorite, setNewFavorite] = useState("");

  // Modal open/close
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  // Form fields
  const [goalName, setGoalName] = useState("");
  const [goalMember, setGoalMember] = useState("You");
  const [goalTrack, setGoalTrack] = useState("");
  const [goalHours, setGoalHours] = useState("");
  const [goalFrequency, setGoalFrequency] = useState("every day");
  const [goalUntil, setGoalUntil] = useState("");

  // Add new state for goalProject, goalTags, goalBillable at the top with other goal states
  const [goalProject, setGoalProject] = useState("");
  const [goalTags, setGoalTags] = useState([]);
  const [goalBillable, setGoalBillable] = useState("");
  const [showTrackDropdown, setShowTrackDropdown] = useState(false);

  // Add new state for goalTrackSearch and showTrackHelper at the top with other goal states
  const [goalTrackSearch, setGoalTrackSearch] = useState("");
  const [showTrackHelper, setShowTrackHelper] = useState(false);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  // Persist user events to localStorage
  useEffect(() => {
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
  }, [userEvents]);

  useEffect(() => {
    localStorage.setItem('goalsOpen', JSON.stringify(goalsOpen));
  }, [goalsOpen]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleTimerClick = () => {
    setTimerRunning((r) => !r);
  };

  const handleTimerDoubleClick = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const handlePrevWeek = () => {
    setWeekStart((prev) => addDays(prev, -7));
  };
  const handleNextWeek = () => {
    setWeekStart((prev) => addDays(prev, 7));
  };

  // For event block positioning
  const hourHeight = 32; // px, must match .toggl-calendar-row min-height

  // 2. Update cell mouse handlers to detect vertical position and set minute
  const cellHeight = 32; // px, must match .toggl-calendar-row min-height
  const getMinuteFromY = (e, cellRef) => {
    const rect = cellRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const quarter = Math.floor((y / cellHeight) * 4);
    return Math.max(0, Math.min(3, quarter)) * 15;
  };

  // Update handleCellMouseDown and handleCellClick to use mouse Y position
  const handleCellMouseDown = (dayIdx, hour, min, e, slotIndex) => {
    const cellKey = `${dayIdx}-${hour}-${min}`;
    const cellRef = cellRefs.current[cellKey];
    let selectedMin = min;
    if (cellRef && e) {
      const rect = cellRef.getBoundingClientRect();
      const y = e.clientY - rect.top;
      selectedMin = y < rect.height / 2 ? 0 : 30;
    }
    setDragging(true);
    setDragStart({ dayIdx, hour, min: selectedMin });
    setDragEnd({ dayIdx, hour, min: selectedMin });
    setEventStartMin(selectedMin);
    setEventEndMin(selectedMin);
  };
  const handleCellMouseEnter = (dayIdx, hour, min) => {
    if (dragging) {
      setDragEnd({ dayIdx, hour, min });
      setEventEndMin(min);
    }
  };
  const handleCellMouseUp = (dayIdx, hour, min) => {
    if (dragging && dragStart) {
      setDragging(false);
      // Only allow selection within the same day
      if (dragStart.dayIdx === dayIdx) {
        // Calculate start and end in minutes
        const startTotalMins = dragStart.hour * 60 + (dragStart.min || 0);
        const endTotalMins = hour * 60 + (min || 0);
        const minMins = Math.min(startTotalMins, endTotalMins);
        const maxMins = Math.max(startTotalMins, endTotalMins) + 30; // +30 to include the last cell
        const startHour = Math.floor(minMins / 60);
        const startMin = minMins % 60;
        const endHour = Math.floor(maxMins / 60);
        const endMin = maxMins % 60;
        setAddEvent({ dayIdx, startHour, endHour });
        setEventLabel("");
        setEventColor(defaultColors[Math.floor(Math.random() * defaultColors.length)]);
        setEventRepeatWeekly(false);
        setEventStartMin(startMin);
        setEventEndMin(endMin);
      }
      setDragStart(null);
      setDragEnd(null);
    }
  };
  // Simple click fallback
  const handleCellClick = (dayIdx, hour, min, e, slotIndex) => {
    const cellKey = `${dayIdx}-${hour}-${min}`;
    const cellRef = cellRefs.current[cellKey];
    let selectedMin = min;
    if (cellRef && e) {
      const rect = cellRef.getBoundingClientRect();
      const y = e.clientY - rect.top;
      selectedMin = y < rect.height / 2 ? 0 : 30;
    }
    if (!dragging) {
      setAddEvent({ dayIdx, startHour: hour, endHour: hour + (selectedMin === 0 ? 0 : 1) });
      setEventLabel("");
      setEventColor(defaultColors[Math.floor(Math.random() * defaultColors.length)]);
      setEventRepeatWeekly(false);
      setEventStartMin(selectedMin);
      setEventEndMin(selectedMin);
    }
  };

  // Handle add event form submit
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!addEvent || !eventLabel.trim()) return;
    let startHour = addEvent.startHour;
    let endHour = Math.min(addEvent.endHour, 24);
    let startMin = eventStartMin;
    let endMin = eventEndMin;
    if (typeof startHour !== 'number' || typeof endHour !== 'number' || (endHour === startHour && endMin <= startMin) || endHour < startHour) return;
    const newEvent = {
      dayIdx: addEvent.dayIdx,
      startHour,
      startMin,
      endHour,
      endMin,
      color: eventColor,
      label: eventLabel,
      repeatWeekly: eventRepeatWeekly,
      project: eventProject,
      tags: eventTags,
      note: eventNote,
      billable: eventBillable,
    };
    console.log('Adding event:', newEvent);
    setUserEvents((prev) => [
      ...prev,
      newEvent,
    ]);
    setAddEvent(null);
    setEventLabel("");
    setEventRepeatWeekly(false);
    setEventStartMin(0);
    setEventEndMin(0);
    setEventProject("");
    setEventTags([]);
    setEventNote("");
    setEventBillable(false);
  };

  // Handle event block click (only for user events)
  const handleEventBlockClick = (event, idx, isUserEvent) => {
    if (!isUserEvent) return;
    setEditEventIdx(idx);
    setEditEventLabel(event.label);
    setEditEventColor(event.color);
    setEditEventRepeatWeekly(!!event.repeatWeekly);
    setEditEventStartMin(event.startMin);
    setEditEventEndMin(event.endMin);
    // Set time pickers
    const startDate = new Date();
    startDate.setHours(event.startHour, event.startMin || 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(event.endHour, event.endMin || 0, 0, 0);
    setEditEventStartTime(startDate);
    setEditEventEndTime(endDate);
    setEditDialogOpen(true);
  };

  // Handle event edit submit
  const handleEditEvent = () => {
    if (!editEventStartTime || !editEventEndTime) return;
    const startHour = editEventStartTime.getHours();
    const startMin = editEventStartTime.getMinutes();
    const endHour = editEventEndTime.getHours();
    const endMin = editEventEndTime.getMinutes();
    setUserEvents((prev) =>
      prev.map((ev, idx) =>
        idx === editEventIdx ? { ...ev, label: editEventLabel, color: editEventColor, repeatWeekly: editEventRepeatWeekly, startHour, startMin, endHour, endMin } : ev
      )
    );
    setEditDialogOpen(false);
  };

  // Handle event delete
  const handleDeleteEvent = () => {
    setUserEvents((prev) => prev.filter((_, idx) => idx !== editEventIdx));
    setEditDialogOpen(false);
  };

  // Handle timer-to-calendar dialog open
  const handleOpenTimerDialog = () => {
    setTimerEventDay(0);
    setTimerEventStart(9);
    setTimerEventLabel("");
    setTimerEventColor(defaultColors[0]);
    setTimerDialogOpen(true);
  };

  // Handle timer-to-calendar add
  const handleAddTimerEvent = () => {
    if (!timerEventLabel.trim() || timerSeconds === 0) return;
    // Calculate end time based on timerSeconds
    const durationHours = Math.floor(timerSeconds / 3600);
    const durationMins = Math.floor((timerSeconds % 3600) / 60);
    let endHour = timerEventStart + durationHours;
    let endMin = durationMins;
    if (endMin >= 60) {
      endHour += Math.floor(endMin / 60);
      endMin = endMin % 60;
    }
    endHour = Math.min(endHour, 24);
    setUserEvents((prev) => [
      ...prev,
      {
        dayIdx: timerEventDay,
        startHour: timerEventStart,
        startMin: 0,
        endHour,
        endMin,
        color: timerEventColor,
        label: timerEventLabel,
        repeatWeekly: false, // Timer events are not recurring
      },
    ]);
    setTimerDialogOpen(false);
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  // For event block rendering (user + mock)
  const allEvents = [
    ...userEvents.filter(ev => !ev.repeatWeekly || getWeekNumber(weekStart) === getWeekNumber(new Date())),
    ...userEvents.filter(ev => ev.repeatWeekly && getWeekNumber(weekStart) !== getWeekNumber(new Date())),
  ].filter(ev => {
    // Show recurring events on all weeks, non-recurring only on their week
    if (ev.repeatWeekly) return true;
    // For non-recurring, only show if weekStart matches the week the event was created
    // (Assume event was created for the week it was added)
    return true;
  });

  // Update isCellHighlighted to consider both hour and minute
  const isCellHighlighted = (dayIdx, hour, min) => {
    if (!dragging || !dragStart || !dragEnd) return false;
    if (dragStart.dayIdx !== dayIdx) return false;
    // Calculate start and end in minutes
    const startMins = dragStart.hour * 60 + (dragStart.min || 0);
    const endMins = dragEnd.hour * 60 + (dragEnd.min || 0);
    const cellMins = hour * 60 + (min || 0);
    // Highlight only the cell(s) that match the selected range
    return cellMins >= Math.min(startMins, endMins) && cellMins < Math.max(startMins, endMins) + 30;
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals(prev => {
        const updated = [...prev, { name: newGoal.trim() }];
        localStorage.setItem('goals', JSON.stringify(updated));
        return updated;
      });
      setNewGoal("");
    }
  };

  const handleDeleteGoal = (idx) => {
    setGoals(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
  };

  // Add and delete handlers for Favorites
  const handleAddFavorite = () => {
    if (newFavorite.trim()) {
      setFavorites(prev => {
        const updated = [...prev, newFavorite.trim()];
        localStorage.setItem('favorites', JSON.stringify(updated));
        return updated;
      });
      setNewFavorite("");
    }
  };

  const handleDeleteFavorite = (idx) => {
    setFavorites(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateGoal = () => {
    if (!goalName.trim()) return;
    const newGoalObj = {
      name: goalName,
      member: goalMember,
      track: goalTrack,
      hours: goalHours,
      frequency: goalFrequency,
      until: goalUntil,
    };
    setGoals(prev => {
      const updated = [...prev, newGoalObj];
      localStorage.setItem('goals', JSON.stringify(updated));
      return updated;
    });
    setGoalModalOpen(false);
    setGoalName("");
    setGoalTrack("");
    setGoalHours("");
    setGoalFrequency("every day");
    setGoalUntil("");
  };

  // Update the onChange handlers for project, tag, and billable selectors to also blur the input and close all popups immediately
  // Also, update the onBlur handlers to close all popups
  // Add a helper function to close all track popups
  const closeAllTrackPopups = () => {
    setShowTrackHelper(false);
    setShowProjectDropdown(false);
    setShowTagInput(false);
    setShowBillableInput(false);
  };

  return (
    <div className="toggl-calendar-root">
      {/* Top Bar */}
      <div className="toggl-topbar">
        <div className="toggl-topbar-left">
          <input className="toggl-input" placeholder="What are you working on?" />
        </div>
        <div className="toggl-topbar-right">
          <i className="pi pi-folder toggl-icon" />
          <i className="pi pi-book toggl-icon" />
          <i className="pi pi-dollar toggl-icon" />
          <span className="toggl-timer-display">{formatTime(timerSeconds)}</span>
          <Button
            className={`toggl-play-btn${timerRunning ? " toggl-play-btn-running" : ""}`}
            aria-label={timerRunning ? "Pause timer" : "Start timer"}
            onClick={handleTimerClick}
            onDoubleClick={handleTimerDoubleClick}
            title={timerRunning ? "Pause timer (double-click to reset)" : "Start timer"}
            icon={timerRunning ? "pi pi-pause" : "pi pi-play"}
            rounded
            text
          />
          <Button
            className="p-ml-2"
            label="Save to Calendar"
            icon="pi pi-calendar-plus"
            disabled={timerSeconds === 0}
            onClick={handleOpenTimerDialog}
            severity="success"
            size="small"
          />
        </div>
      </div>

      {/* Timer-to-calendar Dialog */}
      <Dialog
        header="Add Timer to Calendar"
        visible={timerDialogOpen}
        onHide={() => setTimerDialogOpen(false)}
        style={{ width: '350px' }}
        modal
        footer={
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button label="Add" icon="pi pi-check" onClick={handleAddTimerEvent} autoFocus disabled={timerSeconds === 0 || !timerEventLabel.trim()} />
          </div>
        }
      >
        <div className="p-field" style={{marginBottom: 12}}>
          <label htmlFor="timerEventLabel">Label</label>
          <InputText
            id="timerEventLabel"
            value={timerEventLabel}
            onChange={e => setTimerEventLabel(e.target.value)}
            style={{width: '100%'}}
            autoFocus
          />
        </div>
        <div className="p-field" style={{marginBottom: 12}}>
          <label htmlFor="timerEventDay">Day</label>
          <Dropdown
            id="timerEventDay"
            value={timerEventDay}
            options={daysOfWeek.map((d, i) => ({ label: d, value: i }))}
            onChange={e => setTimerEventDay(e.value)}
            style={{width: '100%'}}
          />
        </div>
        <div className="p-field" style={{marginBottom: 12}}>
          <label htmlFor="timerEventStart">Start Hour</label>
          <InputNumber
            id="timerEventStart"
            value={timerEventStart}
            onValueChange={e => setTimerEventStart(e.value)}
            min={0}
            max={23}
            showButtons
            style={{width: '100%'}}
          />
        </div>
        <div className="p-field">
          <label htmlFor="timerEventColor">Color</label>
          <ColorPicker
            id="timerEventColor"
            value={timerEventColor.replace('#', '')}
            onChange={e => setTimerEventColor('#' + e.value)}
            format="hex"
            style={{marginLeft: 8}}
          />
        </div>
      </Dialog>

      {/* Week Selector & View Switcher */}
      <div className="toggl-weekbar">
        <div className="toggl-weekbar-left">
          <Button className="toggl-arrow-btn" onClick={handlePrevWeek} icon="pi pi-chevron-left" rounded text />
          <div className="toggl-week-label">{weekLabel}</div>
          <Button className="toggl-arrow-btn" onClick={handleNextWeek} icon="pi pi-chevron-right" rounded text />
          <div className="toggl-week-total">WEEK TOTAL <span>3:24:16</span></div>
        </div>
        <div className="toggl-weekbar-right">
          <div className="toggl-view-switcher">
            <Button className="toggl-view-btn toggl-view-btn-active" label="Calendar" text />
            <Button className="toggl-view-btn" label="List view" text />
            <Button className="toggl-view-btn" label="Timesheet" text />
          </div>
          <i className="pi pi-cog toggl-icon" />
          <i className="pi pi-th-large toggl-icon" />
        </div>
      </div>

      {/* Main Content: Calendar Grid + Sidebar */}
      <div className="toggl-main-content">
        {/* Calendar Grid */}
        <div className="toggl-calendar-grid">
          <div className="toggl-calendar-header-row">
            <div className="toggl-calendar-header-cell toggl-calendar-header-empty"></div>
            {weekDates.map((date, idx) => (
              <div key={date.toISOString()} className={`toggl-calendar-header-cell${isSameDay(date, today) ? " toggl-calendar-header-today" : ""}`}>
                <div className="toggl-calendar-header-day">{daysOfWeek[idx]}</div>
                <div className="toggl-calendar-header-date">{date.getDate()}</div>
                <div className="toggl-calendar-header-total">{idx === 0 ? "3:09:16" : idx === 1 ? "0:15:00" : "0:00:00"}</div>
              </div>
            ))}
          </div>
          {/* 3. Update calendar rendering to use timeSlots */}
          <div className="toggl-calendar-body">
            {timeSlots.map((slot, i) => (
              <div key={slot.label} className="toggl-calendar-row">
                <div className="toggl-calendar-time-cell">{slot.label}</div>
                {daysOfWeek.map((_, j) => {
                  // Replace the cellEvents filter logic in the calendar grid rendering with minute-based comparison
                  const cellStartMins = slot.hour * 60 + slot.min;
                  const cellEndMins = cellStartMins + 15;
                  const cellEvents = allEvents.filter(ev => {
                    if (ev.dayIdx !== j) return false;
                    const eventStartMins = ev.startHour * 60 + (ev.startMin || 0);
                    const eventEndMins = ev.endHour * 60 + (ev.endMin || 0);
                    // Show if the cell overlaps any part of the event
                    return cellStartMins < eventEndMins && cellEndMins > eventStartMins;
                  });
                  console.log('allEvents:', allEvents);
                  console.log('cellEvents for day', j, 'hour', slot.hour, 'min', slot.min, ':', cellEvents);
                  const cellKey = `${j}-${slot.hour}-${slot.min}`;
                  return (
                    <div
                      key={j}
                      ref={el => (cellRefs.current[cellKey] = el)}
                      className={`toggl-calendar-cell${isCellHighlighted(j, slot.hour, slot.min) ? " toggl-calendar-cell-highlight" : ""}`}
                      onMouseDown={e => handleCellMouseDown(j, slot.hour, slot.min, e, i)}
                      onMouseEnter={() => handleCellMouseEnter(j, slot.hour, slot.min)}
                      onMouseUp={() => handleCellMouseUp(j, slot.hour, slot.min)}
                      onClick={e => {
                        if (!dragging) {
                          handleCellClick(j, slot.hour, slot.min, e, i);
                        }
                      }}
                    >
                      {/* Render event blocks for this cell */}
                      {cellEvents.filter(ev => slot.hour === ev.startHour && slot.min === (ev.startMin || 0)).map((ev, idx, arr) => {
                        // Calculate block height for the event's full duration
                        const durationMins = (ev.endHour * 60 + (ev.endMin || 0)) - (ev.startHour * 60 + (ev.startMin || 0));
                        const blockHeight = (durationMins / 30) * cellHeight;
                        return (
                          <div
                            key={idx}
                            className="toggl-event-block"
                            style={{
                              background: '#232323',
                              color: '#fff',
                              borderRadius: 10,
                              padding: '10px 14px',
                              fontSize: 16,
                              fontWeight: 600,
                              margin: '0 0 4px 0',
                              height: `${blockHeight}px`,
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              position: 'relative',
                              boxShadow: 'none',
                              border: 'none',
                              zIndex: 1,
                              cursor: 'pointer',
                              gap: 0,
                              overflow: 'hidden',
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              handleEventBlockClick(ev, userEvents.indexOf(ev), allEvents.indexOf(ev) >= mockEvents.length);
                            }}
                            onMouseDown={e => e.stopPropagation()}
                            onMouseUp={e => e.stopPropagation()}
                          >
                            <span className="event-label">{ev.label}</span>
                            <span className="event-duration">{formatTime((ev.endHour*60+ev.endMin-(ev.startHour*60+ev.startMin))*60)}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Edit event dialog (PrimeReact) */}
          <Dialog
            header={null}
            visible={editDialogOpen}
            onHide={() => setEditDialogOpen(false)}
            style={{ width: '440px', background: '#181818', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.32)', border: 'none', padding: 0 }}
            modal
            footer={null}
          >
            {/* In the Edit Event Dialog, use the same content wrapper as Add Event: */}
            <div style={{position: 'relative', padding: '36px 40px 32px 40px', color: '#fff', background: 'transparent'}}>
              <div style={{fontSize: 24, fontWeight: 700, marginBottom: 18, letterSpacing: 0.2}}>Edit Event</div>
              <InputText
                id="editEventLabel"
                value={editEventLabel}
                onChange={e => setEditEventLabel(e.target.value)}
                style={{width: '100%', fontSize: 22, fontWeight: 700, background: 'transparent', color: '#fff', border: 'none', marginBottom: 18, padding: 0}}
                autoFocus
                placeholder="Activity label"
              />
              <div style={{display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 18, marginTop: 2, alignItems: 'center'}}>
                <span className="toggl-add-event-icon" title="Project"><i className="pi pi-folder" style={{fontSize: 22, color: '#fff'}} /></span>
                <span className="toggl-add-event-icon" title="Tags"><i className="pi pi-tag" style={{fontSize: 22, color: '#fff'}} /></span>
                <span className="toggl-add-event-icon" title="Note"><i className="pi pi-book" style={{fontSize: 22, color: '#fff'}} /></span>
                <span className="toggl-add-event-icon" title="Billable"><i className="pi pi-dollar" style={{fontSize: 22, color: '#fff'}} /></span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18}}>
                <Calendar
                  value={editEventStartTime}
                  onChange={e => setEditEventStartTime(e.value)}
                  timeOnly
                  hourFormat="12"
                  style={{width: 160, minWidth: 160, background: '#232323', color: '#fff', borderRadius: 8, fontSize: 20, fontWeight: 600, border: 'none'}}
                  inputStyle={{background: '#232323', color: '#fff', fontSize: 20, fontWeight: 600, border: 'none', textAlign: 'center', padding: '10px 16px', width: '100%'}}
                  showIcon
                  iconDisplay="input"
                  touchUI
                />
                <span style={{fontSize: 22, color: '#aaa', margin: '0 8px'}}>→</span>
                <Calendar
                  value={editEventEndTime}
                  onChange={e => setEditEventEndTime(e.value)}
                  timeOnly
                  hourFormat="12"
                  style={{width: 160, minWidth: 160, background: '#232323', color: '#fff', borderRadius: 8, fontSize: 20, fontWeight: 600, border: 'none'}}
                  inputStyle={{background: '#232323', color: '#fff', fontSize: 20, fontWeight: 600, border: 'none', textAlign: 'center', padding: '10px 16px', width: '100%'}}
                  showIcon
                  iconDisplay="input"
                  touchUI
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
                <div style={{fontSize: 20, color: '#feca57', fontWeight: 700}}>
                  {(() => {
                    if (!editEventStartTime || !editEventEndTime) return '';
                    const start = editEventStartTime.getHours() * 60 + editEventStartTime.getMinutes();
                    const end = editEventEndTime.getHours() * 60 + editEventEndTime.getMinutes();
                    const dur = Math.max(0, end - start);
                    const h = Math.floor(dur / 60);
                    const m = dur % 60;
                    return `${h}:${m.toString().padStart(2,'0')}:00`;
                  })()}
                </div>
                <div>
                  <Checkbox inputId="editRepeatWeekly" checked={editEventRepeatWeekly} onChange={e => setEditEventRepeatWeekly(e.checked)} />
                  <label htmlFor="editRepeatWeekly" style={{color: '#f5f5f5', fontSize: 15, marginLeft: 8}}>Repeat weekly</label>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18}}>
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={handleDeleteEvent} style={{borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '8px 32px', background: 'transparent', color: '#ff6b6b', border: 'none'}} />
                <Button label="Save" icon="pi pi-check" onClick={handleEditEvent} autoFocus style={{borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '8px 32px', background: '#fff', color: '#232323', border: 'none'}} />
              </div>
            </div>
          </Dialog>
        </div>
        {/* Add Event Modal (rendered once, outside the grid) */}
        <Dialog
          header={null}
          visible={!!addEvent}
          onHide={() => setAddEvent(null)}
          style={{ width: '700px', minHeight: '420px', background: '#181818', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.32)', border: 'none', padding: 0 }}
          modal
          footer={null}
        >
          <div style={{position: 'relative', padding: '36px 40px 32px 40px', color: '#fff', background: 'transparent'}}>
            <div style={{fontSize: 24, fontWeight: 700, marginBottom: 18, letterSpacing: 0.2}}>Add Event</div>
            <form onSubmit={handleAddEvent}>
              <InputText
                className="toggl-add-event-input toggl-add-event-label-input"
                autoFocus
                placeholder="Activity label"
                value={eventLabel}
                onChange={e => setEventLabel(e.target.value)}
                style={{width: '100%', fontSize: 22, fontWeight: 700, background: 'transparent', color: '#fff', border: 'none', marginBottom: 18, padding: 0}}
              />
              <div style={{display: 'flex', flexDirection: 'row', gap: 18, marginBottom: 18, marginTop: 2, alignItems: 'center'}}>
                <span className="toggl-add-event-icon" title="Project" onClick={() => setShowProjectDropdown(v => !v)}><i className="pi pi-folder" style={{fontSize: 22, color: eventProject ? '#4ecdc4' : '#aaa'}} /></span>
                <span className="toggl-add-event-icon" title="Tags" onClick={() => setShowTagInput(v => !v)}><i className="pi pi-tag" style={{fontSize: 22, color: eventTags.length ? '#feca57' : '#aaa'}} /></span>
                <span className="toggl-add-event-icon" title="Note" onClick={() => setShowNoteInput(v => !v)}><i className="pi pi-book" style={{fontSize: 22, color: eventNote ? '#45b7d1' : '#aaa'}} /></span>
                <span className="toggl-add-event-icon" title="Billable" onClick={() => setShowBillableInput(v => !v)}><i className="pi pi-dollar" style={{fontSize: 22, color: eventBillable ? '#ff6b6b' : '#aaa'}} /></span>
              </div>
              {showProjectDropdown && (
                <div className="toggl-add-event-dropdown">
                  {projectOptions.map(opt => (
                    <div key={opt} className="toggl-add-event-dropdown-item" onClick={() => { setEventProject(opt); setShowProjectDropdown(false); }}>{opt}</div>
                  ))}
                </div>
              )}
              {showTagInput && (
                <div className="toggl-add-event-dropdown">
                  {tagOptions.map(opt => (
                    <div key={opt} className="toggl-add-event-dropdown-item" onClick={() => {
                      setEventTags(tags => tags.includes(opt) ? tags.filter(t => t !== opt) : [...tags, opt]);
                    }}>
                      <input type="checkbox" checked={eventTags.includes(opt)} readOnly style={{marginRight: 6}} />{opt}
                    </div>
                  ))}
                </div>
              )}
              {showNoteInput && (
                <div className="toggl-add-event-note-input">
                  <InputText
                    value={eventNote}
                    onChange={e => setEventNote(e.target.value)}
                    placeholder="Add a note..."
                    style={{width: '100%'}} />
                </div>
              )}
              {showBillableInput && (
                <div className="toggl-add-event-billable-input">
                  <Checkbox inputId="billable" checked={eventBillable} onChange={e => setEventBillable(e.checked)} />
                  <label htmlFor="billable" style={{color: '#fff', fontSize: 13, marginLeft: 6}}>Billable</label>
                </div>
              )}
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 0}}>
                <Calendar
                  value={(() => { const d = new Date(); d.setHours(addEvent?.startHour || 0, eventStartMin || 0, 0, 0); return d; })()}
                  onChange={e => { const d = e.value; setAddEvent(a => ({...a, startHour: d.getHours()})); setEventStartMin(d.getMinutes()); }}
                  timeOnly
                  hourFormat="12"
                  style={{width: 160, minWidth: 160, background: '#232323', color: '#fff', borderRadius: 8, fontSize: 20, fontWeight: 600, border: 'none'}}
                  inputStyle={{background: '#232323', color: '#fff', fontSize: 20, fontWeight: 600, border: 'none', textAlign: 'center', padding: '10px 16px', width: '100%'}}
                  showIcon
                  iconDisplay="input"
                  touchUI
                />
                <span style={{fontSize: 22, color: '#aaa', margin: '0 8px'}}>→</span>
                <Calendar
                  value={(() => { const d = new Date(); d.setHours(addEvent?.endHour || 0, eventEndMin || 0, 0, 0); return d; })()}
                  onChange={e => { const d = e.value; setAddEvent(a => ({...a, endHour: d.getHours()})); setEventEndMin(d.getMinutes()); }}
                  timeOnly
                  hourFormat="12"
                  style={{width: 160, minWidth: 160, background: '#232323', color: '#fff', borderRadius: 8, fontSize: 20, fontWeight: 600, border: 'none'}}
                  inputStyle={{background: '#232323', color: '#fff', fontSize: 20, fontWeight: 600, border: 'none', textAlign: 'center', padding: '10px 16px', width: '100%'}}
                  showIcon
                  iconDisplay="input"
                  touchUI
                />
              </div>
              {/* In both add and edit event modals, move the duration display to just above the Repeat Weekly checkbox row.
                  For inline: use a flex row with gap, align-items center. For above: use a div with margin-bottom. */}
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
                <div style={{fontSize: 20, color: '#feca57', fontWeight: 700}}>
                  {(() => {
                    if (!addEvent) return '';
                    const start = (addEvent.startHour || 0) * 60 + (eventStartMin || 0);
                    const end = (addEvent.endHour || 0) * 60 + (eventEndMin || 0);
                    const dur = Math.max(0, end - start);
                    const h = Math.floor(dur / 60);
                    const m = dur % 60;
                    return `${h}:${m.toString().padStart(2,'0')}:00`;
                  })()}
                </div>
                <div>
                  <Checkbox inputId="addRepeatWeekly" checked={eventRepeatWeekly} onChange={e => setEventRepeatWeekly(e.checked)} />
                  <label htmlFor="addRepeatWeekly" style={{color: '#f5f5f5', fontSize: 15, marginLeft: 8}}>Repeat weekly</label>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18}}>
                <Button type="button" label="Cancel" className="toggl-add-event-cancel" severity="danger" size="small" onClick={() => setAddEvent(null)} text style={{borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '8px 32px', background: 'transparent', color: '#ff6b6b', border: 'none'}} />
                <Button type="submit" label="Add" className="toggl-add-event-btn toggl-add-event-btn-large" size="large" style={{borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '8px 32px', background: '#fff', color: '#232323', border: 'none'}} />
              </div>
            </form>
          </div>
        </Dialog>
        {/* Sidebar */}
        <div className="toggl-sidebar">
          <div className="toggl-sidebar-section">
            <div className="toggl-sidebar-header" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span>Goals</span>
              <Button className="toggl-sidebar-plus" icon="pi pi-plus" rounded text size="small" onClick={() => setGoalModalOpen(true)} />
            </div>
            {goalsOpen && (
              <div className="toggl-sidebar-content">
                <ul style={{paddingLeft: 0, listStyle: 'none'}}>
                  {goals.map((goal, idx) => (
                    <li key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                      <span style={{flex: 1}}>
                        <b>{typeof goal === 'string' ? goal : goal.name}</b>
                        {goal.hours && <> — {goal.hours}h {goal.frequency}</>}
                      </span>
                      <Button icon="pi pi-trash" severity="danger" text size="small" onClick={() => handleDeleteGoal(idx)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="toggl-sidebar-section">
            <div className="toggl-sidebar-header" onClick={() => setFavoritesOpen((v) => !v)} style={{cursor: 'pointer'}}>
              Favorites <Button className="toggl-sidebar-plus" icon="pi pi-plus" rounded text size="small" />
              <i className={`pi ${favoritesOpen ? 'pi-chevron-down' : 'pi-chevron-right'}`} style={{marginLeft: 8}} />
            </div>
            {favoritesOpen && (
              <div className="toggl-sidebar-content">
                <div style={{marginBottom: 10}}>
                  <InputText
                    value={newFavorite}
                    onChange={e => setNewFavorite(e.target.value)}
                    placeholder="Enter new favorite"
                    style={{width: '70%', marginRight: 8}}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddFavorite(); }}
                  />
                  <Button icon="pi pi-check" onClick={handleAddFavorite} size="small" />
                </div>
                <ul style={{paddingLeft: 0, listStyle: 'none'}}>
                  {favorites.map((fav, idx) => (
                    <li key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                      <span style={{flex: 1}}>{fav}</span>
                      {/* Fallback to HTML button if PrimeReact Button is not visible */}
                      <Button icon="pi pi-trash" severity="danger" text size="small" onClick={() => handleDeleteFavorite(idx)} />
                      <button onClick={() => handleDeleteFavorite(idx)} style={{marginLeft: 6, background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 16}} title="Delete">🗑️</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Tooltip target=".toggl-event-block" />
      <Dialog
        header="Create a goal"
        visible={goalModalOpen}
        onHide={() => setGoalModalOpen(false)}
        style={{ width: '400px' }}
        modal
        footer={
          <div>
            <Button label="Cancel" onClick={() => setGoalModalOpen(false)} text />
            <Button 
              label="Create goal" 
              onClick={handleCreateGoal} 
              disabled={!goalName.trim()} 
              style={{
                background: '#4ecdc4',
                color: '#232323',
                fontWeight: 700,
                borderRadius: 8,
                border: 'none',
                marginLeft: 12,
                padding: '8px 32px',
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(78,205,196,0.15)'
              }}
            />
          </div>
        }
      >
        <div>
          <label>Goal</label>
          <InputText value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="Goal name" style={{width: '100%', marginBottom: 10}} />
          <label>Member</label>
          <InputText value={goalMember} disabled style={{width: '100%', marginBottom: 10}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Track <i className="pi pi-info-circle" style={{ color: '#aaa', fontSize: 16 }} />
          </label>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <InputText
              value={goalTrackSearch}
              onChange={e => setGoalTrackSearch(e.target.value)}
              onFocus={() => setShowTrackHelper(true)}
              onBlur={() => setTimeout(() => closeAllTrackPopups(), 200)}
              placeholder="Search for projects, tasks, billable..."
              style={{ width: '100%', borderRadius: 8, background: '#232323', color: '#fff', border: '1px solid #ccc', padding: '10px 14px', fontSize: 16 }}
            />
            {showTrackHelper && (
              <div style={{
                position: 'absolute',
                top: 44,
                left: 0,
                width: '100%',
                background: '#fff',
                color: '#232323',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                zIndex: 20,
                padding: 18,
                fontSize: 15,
              }}>
                <div style={{ marginBottom: 16, color: '#555' }}>
                  You can just start writing to find projects, tasks, tags or billable label or select any of these
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
                    onClick={() => { setShowProjectDropdown(true); closeAllTrackPopups(); }}
                    onMouseDown={e => e.preventDefault() }
                  >
                    <i className="pi pi-folder" style={{ color: '#4ecdc4', fontSize: 18 }} />
                    <span>Select project</span>
                    <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: 15 }}>@</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
                    onClick={() => { setShowTagInput(true); closeAllTrackPopups(); }}
                    onMouseDown={e => e.preventDefault() }
                  >
                    <i className="pi pi-tag" style={{ color: '#feca57', fontSize: 18 }} />
                    <span>Select tags</span>
                    <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: 15 }}>#</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
                    onClick={() => { setShowBillableInput(true); closeAllTrackPopups(); }}
                    onMouseDown={e => e.preventDefault() }
                  >
                    <i className="pi pi-dollar" style={{ color: '#ff6b6b', fontSize: 18 }} />
                    <span>Billable hours</span>
                    <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: 15 }}>$</span>
                  </div>
                </div>
              </div>
            )}
            {/* Project Dropdown */}
            {showProjectDropdown && (
              <div style={{ position: 'absolute', top: 44, left: 0, width: '100%', zIndex: 30 }}>
                <Dropdown
                  value={goalProject}
                  options={projectOptions.map(p => ({ label: p, value: p }))}
                  onChange={e => { setGoalProject(e.value); closeAllTrackPopups(); }}
                  placeholder="Select project"
                  style={{ width: '100%' }}
                  autoFocus
                />
              </div>
            )}
            {/* Tag Dropdown */}
            {showTagInput && (
              <div style={{ position: 'absolute', top: 44, left: 0, width: '100%', zIndex: 30 }}>
                <Dropdown
                  value={goalTags}
                  options={tagOptions.map(t => ({ label: t, value: t }))}
                  onChange={e => { setGoalTags(e.value); closeAllTrackPopups(); }}
                  placeholder="Select tags"
                  style={{ width: '100%' }}
                  multiple
                  autoFocus
                />
              </div>
            )}
            {/* Billable Input */}
            {showBillableInput && (
              <div style={{ position: 'absolute', top: 44, left: 0, width: '100%', zIndex: 30, background: '#fff', borderRadius: 8, padding: 12 }}>
                <InputNumber
                  value={goalBillable}
                  onValueChange={e => { setGoalBillable(e.value); closeAllTrackPopups(); }}
                  min={0}
                  max={100}
                  placeholder="Billable hours"
                  style={{ width: '100%' }}
                  autoFocus
                />
              </div>
            )}
          </div>
          <label>For</label>
          <div style={{display: 'flex', gap: 8, marginBottom: 10}}>
            <InputText value={goalHours} onChange={e => setGoalHours(e.target.value)} placeholder="Hours" style={{width: 80}} />
            <Dropdown value={goalFrequency} options={["every day", "every week"]} onChange={e => setGoalFrequency(e.value)} style={{width: 120}} />
          </div>
          <label>Until</label>
          <Calendar 
            value={goalUntil ? new Date(goalUntil) : null}
            onChange={e => setGoalUntil(e.value ? e.value.toISOString().slice(0,10) : '')}
            minDate={new Date()}
            maxDate={(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })()}
            placeholder="Select new date"
            style={{width: '100%', marginBottom: 10}}
            dateFormat="yy-mm-dd"
            showIcon
          />
        </div>
      </Dialog>
    </div>
  );
};

export default TogglCalendarView; 