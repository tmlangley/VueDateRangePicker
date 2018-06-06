import { DateTime } from 'luxon';
import Day from './Day';
import NoSelection from './input-states/NoSelection';

export default class Month {
  constructor(dt, opts = {}) {
    this.dt = dt;
    this.ts = dt.ts;
    this.month = dt.month;
    this.currentDay = DateTime.local();
    if (opts) {
      if (opts.hasOwnProperty('restrictedDates')) {
        this.restrictedDates = opts.restrictedDates;
      }
    }
    this._days = this.getDays();
    this.dayIds = new Set();
    this.restrictedDates = null;

    this.state = NoSelection;

    this.states = {
      hover: null,
      focus: null,
      start: opts.hasOwnProperty('start') ? opts.start : null,
      end: opts.hasOwnProperty('end') ? opts.end : null
    };

    this.hasRange = this.states.start && this.states.end;
  }

  [Symbol.iterator]() {
    return this._days.values();
  }

  getStartDate() {
    return this.states.start ? this.states.start : null;
  }

  getEndDate() {
    return this.states.end ? this.states.end : null;
  }

  getDays() {
    const monthStart = DateTime.fromObject({month: this.dt.month, year: this.dt.year});

    let currentDay = monthStart.minus({
      day: monthStart.weekday,
    });

    let month = new Map();
    for (let i = 0; i < 42; i++) {
      const isRestricted = this.isRestrictedDay(currentDay);
      const day = new Day(currentDay, this.currentDay, this.dt.month, isRestricted);
      month.set(day.key, day);
      currentDay = currentDay.plus({day: 1});
    }
    return month;
  }

  getDay(dateTime) {
    const dt = (dateTime instanceof Day) ? dateTime.dt : dateTime;
    return this._days.get(Day.getKey(dt, this.month));
  }

  hasDay(dateTime) {
    const dt = (dateTime instanceof Day) ? dateTime.dt : dateTime;
    return this._days.has(Day.getKey(dt, this.month));
  }

  setHover(day = null) {
    if (day === null) {
      this._days.forEach(d => d.isInRange = false);
      return null;
    }

    if (this.states.start && !this.states.end) {
      this.hasRange = day.ts > this.states.start.ts;
      this._days.forEach(d => {
        d.isInRange = (d.ts > this.states.start.ts && d.ts < day.ts);
      });
    }
  }

  selectDay(day, type, field = null) {
    this.setHover();
    this.state.selectDay(this, day instanceof Day ? day : this.getDay(day), type, field);
    this.hasRange = this.states.start && this.states.end;
    return {
      start: this.states.start,
      end: this.states.end
    }
  }

  inRange(dt) {
    let { start, end } = this.states;
    if (!start || !end || !start.hasOwnProperty('dt') || !end.hasOwnProperty('dt')) {
      return false;
    }

    return (dt.diff(start.dt).toObject().milliseconds > 0 && dt.diff(end.dt).toObject().milliseconds < 0);
  }

  isRestrictedDay(day) {
    let isRestricted = false;
    if (this.restrictedDates) {
      this.restrictedDates.forEach((range) => {
        let hasStart = range.hasOwnProperty('start');
        let hasEnd = range.hasOwnProperty('end');
        if (hasStart && hasEnd) {
          if (day.diff(range.start, 'days').toObject().days > -1 && day.diff(range.end, 'days').toObject().days < -1) {
            isRestricted = true;
          }
        } else if (!hasStart && hasEnd) {
          if (day.diff(range.end, 'days').toObject().days < -1) {
            isRestricted = true;
          }
        } else if (hasStart && !hasEnd) {
          if (day.diff(range.start, 'days').toObject().days > -1) {
            isRestricted = true;
          }
        }
      });
    }
    return isRestricted;
  }
}