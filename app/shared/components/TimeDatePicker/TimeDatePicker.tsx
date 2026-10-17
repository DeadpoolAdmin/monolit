import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useResolution } from "@hotel-smarters/resolution-hook";

interface TimeDatePickerProps {
  // Initial time configuration
  getInitialTime: () => { hour: number; minute: number; date: Date };

  // Root control configuration
  rootControlActiveValue: string;
  rootControlId: string;

  // Date formatting
  formatDate: (date: Date) => string;

  // Callbacks
  onConfirm?: (fullDate: Date) => void | Promise<void>;
  onBack?: () => void;
  onRight?: (index: number, hour: number, minute: number) => void;
  onLeft?: (index: number, hour: number, minute: number) => void;
  onUp?: (index: number) => void;
  onDown?: (index: number) => void;
  onOk?: (index: number, hour: number, minute: number, date: Date) => void;

  // Custom effects and event listeners
  customEffects?: Array<{
    effect: () => void | (() => void);
    dependencies?: React.DependencyList;
  }>;
  customEventListeners?: Array<{
    event: string;
    handler: (e: Event) => void;
  }>;

  // UI customization
  className?: string;
  showArrows?: boolean;

  // Time constraints
  minMinutesFromNow?: number;
  maxDaysFromNow?: number;
}

const isFullDateTimeBeforeNow = (
  date: Date,
  hour: number,
  minute: number
): boolean => {
  const now = new Date();
  const checkDate = new Date(date);
  checkDate.setHours(hour, minute, 0, 0);
  return checkDate < now;
};

const formatWithLeadingZero = (value: number): string =>
  value < 10 ? "0" + value : value.toString();

const getFullDateTime = (date: Date, hour: string, minute: string) => {
  const fullDate = new Date(date); // Make a copy to avoid mutating state
  fullDate.setHours(parseInt(hour));
  fullDate.setMinutes(parseInt(minute));
  fullDate.setSeconds(0);
  fullDate.setMilliseconds(0);
  return fullDate;
};

const TimeDatePicker: React.FC<TimeDatePickerProps> = ({
  getInitialTime,
  rootControlActiveValue,
  rootControlId,
  formatDate,
  onConfirm,
  onBack,
  onRight,
  onLeft,
  onUp,
  onDown,
  onOk,
  customEffects = [],
  customEventListeners = [],
  className = "select-time-picker",
  showArrows = true,
  minMinutesFromNow = 1,
  maxDaysFromNow = 7,
}) => {
  const rootControl = useSelector((state: any) => state.rootControl?.rootControl);
  const serviceControl = useSelector((state: any) => state.serviceControl?.serviceControl);

  const initialTime = getInitialTime();
  const [hour, setHour] = useState<number>(initialTime.hour);
  const [minute, setMinute] = useState<number>(initialTime.minute);
  const [date, setDate] = useState<Date>(initialTime.date);

  const hourInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<Date>(date);
  const dispatch = useDispatch();

  const { getDeviceType } = useResolution();
  const deviceType = getDeviceType();
  const [index, setIndex] = useState<number>(1);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (value >= 0 && value <= 23) setHour(value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (value >= 0 && value <= 59) setMinute(value);
  };

  const defaultOnUp = () => {
    if (hourInputRef.current && minutesInputRef.current) {
      let hour = parseInt(hourInputRef.current.value);
      const minute = parseInt(minutesInputRef.current.value);
      if (isNaN(hour)) hour = 0;
      const newHour = (hour + 1) % 24;

      if (!isFullDateTimeBeforeNow(date, newHour, minute)) {
        hourInputRef.current.value = formatWithLeadingZero(newHour);
        setHour(newHour);
      }
    }
  };

  const defaultOnDown = () => {
    if (hourInputRef.current && minutesInputRef.current) {
      let hour = parseInt(hourInputRef.current.value);
      const minute = parseInt(minutesInputRef.current.value);
      if (isNaN(hour)) hour = 0;
      const newHour = hour === 0 ? 23 : hour - 1;

      if (!isFullDateTimeBeforeNow(date, newHour, minute)) {
        hourInputRef.current.value = formatWithLeadingZero(newHour);
        setHour(newHour);
      }
    }
  };

  const defaultOnMinuteUp = () => {
    if (minutesInputRef.current && hourInputRef.current) {
      const hour = parseInt(hourInputRef.current.value);
      let minute = parseInt(minutesInputRef.current.value);
      if (isNaN(minute)) minute = 0;
      const newMinute = (minute + 1) % 60;

      if (!isFullDateTimeBeforeNow(date, hour, newMinute)) {
        minutesInputRef.current.value = formatWithLeadingZero(newMinute);
        setMinute(newMinute);
      }
    }
  };

  const defaultOnMinuteDown = () => {
    if (minutesInputRef.current && hourInputRef.current) {
      const hour = parseInt(hourInputRef.current.value);
      let minute = parseInt(minutesInputRef.current.value);
      if (isNaN(minute)) minute = 0;
      const newMinute = minute === 0 ? 59 : minute - 1;

      // Check minimum time constraint
      const potentialTime = new Date(date);
      potentialTime.setHours(hour, newMinute, 0, 0);
      const now = new Date();
      const minimumTime = new Date(now.getTime() + minMinutesFromNow * 60 * 1000);

      if (!isFullDateTimeBeforeNow(date, hour, newMinute) && potentialTime >= minimumTime) {
        minutesInputRef.current.value = formatWithLeadingZero(newMinute);
        setMinute(newMinute);
      }
    }
  };

  const defaultOnDateUp = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysFromNow);

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    if (newDate.getDate() !== maxDate.getDate() || newDate.getMonth() !== maxDate.getMonth()) {
      dateRef.current = newDate;
      setDate(dateRef.current);
    }
  };

  const defaultOnDateDown = () => {
    const newDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    if (newDate.getTime() > today.getTime()) {
      newDate.setDate(newDate.getDate() - 1);
      dateRef.current = newDate;
      setDate(dateRef.current);
    }
  };

  const controls = {
    isActive: rootControl === rootControlActiveValue || serviceControl === rootControlActiveValue,
    id: rootControlId,
    back: onBack,
    right: () => {
      if (index !== 3 && index !== 0) {
        setIndex(index + 1);
      }

      if (index == 1) {
        setHour(parseInt(hourInputRef.current?.value as string));
        return;
      }

      if (index == 2) {
        setMinute(parseInt(minutesInputRef.current?.value as string));
        setIndex(3);
        return;
      }

      onRight?.(index, hour, minute);
    },
    left: () => {
      if (index > 1 && index !== 0) {
        setIndex(index - 1);
      }

      if (index == 1) {
        setHour(parseInt(hourInputRef.current?.value as string));
        return;
      }
      if (index == 2) {
        setMinute(parseInt(minutesInputRef.current?.value as string));
      }

      onLeft?.(index, hour, minute);
    },
    up: () => {
      if (index == 1) {
        onUp ? onUp(index) : defaultOnUp();
        return;
      }

      if (index == 2) {
        onUp ? onUp(index) : defaultOnMinuteUp();
        return;
      }

      if (index == 3) {
        onUp ? onUp(index) : defaultOnDateUp();
      }
    },
    down: () => {
      if (index == 1) {
        onDown ? onDown(index) : defaultOnDown();
        return;
      }
      if (index == 2) {
        onDown ? onDown(index) : defaultOnMinuteDown();
        return;
      }

      if (index == 3) {
        onDown ? onDown(index) : defaultOnDateDown();
      }
    },
    ok: () => {
      if (index == 1) {
        setHour(parseInt(hourInputRef.current?.value as string));
        setIndex(2);
        return;
      }

      if (index == 2) {
        setMinute(parseInt(minutesInputRef.current?.value as string));
        setIndex(3);
        return;
      }

      if (index == 3) {
        onOk?.(index, hour, minute, date);
      }
    },
  };

  useKeydown(controls);

  // Dispatch time values whenever they change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('updateTimeValues', {
      detail: {
        hour,
        minute,
        date
      }
    }));
  }, [hour, minute, date]);

  // Default confirm handler
  const defaultOnConfirm = async (e: Event) => {
    const { detail } = e as CustomEvent;
    if (detail === 'confirm') {
      const fullDate = getFullDateTime(
        dateRef.current,
        hourInputRef.current?.value as string,
        minutesInputRef.current?.value as string
      );
      await onConfirm?.(fullDate);
    }
  };

  // Set up custom effects
  customEffects.forEach(({ effect, dependencies = [] }) => {
    useEffect(effect, dependencies);
  });

  // Set up custom event listeners
  useEffect(() => {
    customEventListeners.forEach(({ event, handler }) => {
      window.addEventListener(event, handler);
    });

    return () => {
      customEventListeners.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [customEventListeners]);

  // Default confirm event listener
  useEffect(() => {
    if (onConfirm) {
      window.addEventListener('confirm', defaultOnConfirm);
      return () => {
        window.removeEventListener('confirm', defaultOnConfirm);
      };
    }
  }, []);

  return (
    <div className={className}>
      <div className="time-group">
        <div className="hours">
          {showArrows && <FaCaretUp onClick={() => onUp ? onUp(1) : defaultOnUp()} />}
          <input
            ref={hourInputRef}
            className={
              controls.isActive && deviceType === 'TV' && index == 1 ? 'active' : ''
            }
            type="number"
            value={formatWithLeadingZero(hour)}
            min={0}
            max={23}
            onChange={handleHourChange}
            style={{
              color: 'var(--card-text-color, var(--initial-card-text-color))'
            }}
          />
          {showArrows && <FaCaretDown onClick={() => onDown ? onDown(1) : defaultOnDown()} />}
        </div>

        <p
          style={{
            color: 'var(--paragraph-text-color, var(--initial-paragraph-text-color))'
          }}
        >
          :
        </p>

        <div className="hours">
          {showArrows && <FaCaretUp onClick={() => onUp ? onUp(2) : defaultOnMinuteUp()} />}
          <input
            className={
              controls.isActive && deviceType === 'TV' && index == 2 ? 'active' : ''
            }
            type="number"
            value={formatWithLeadingZero(minute)}
            min={0}
            max={59}
            onChange={handleMinuteChange}
            ref={minutesInputRef}
            style={{
              color: 'var(--card-text-color, var(--initial-card-text-color))'
            }}
          />
          {showArrows && <FaCaretDown onClick={() => onDown ? onDown(2) : defaultOnMinuteDown()} />}
        </div>

        <div className="hours">
          {showArrows && <FaCaretUp onClick={() => onUp ? onUp(3) : defaultOnDateUp()} />}
          <div
            className={`date ${controls.isActive && deviceType === 'TV' && index == 3 ? 'active' : ''}`}
            style={{
              color: 'var(--card-text-color, var(--initial-card-text-color))'
            }}
          >
            {formatDate(date)}
          </div>
          {showArrows && <FaCaretDown onClick={() => onDown ? onDown(3) : defaultOnDateDown()} />}
        </div>
      </div>
    </div>
  );
};

export default TimeDatePicker;
