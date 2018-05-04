import { DateTime } from 'luxon';
import Day from './Day';
import NoSelection from './input-states/NoSelection';

export default class Month {
  constructor(dt = DateTime.local(), options = null) {
    this.dt = dt;
    this.ts = dt.ts;
    this.month = dt.month;
    if (options && options.hasOwnProperty('childMonth') && !options.childMonth) {
      this.prevMonth = new Month(dt.minus({ months: 1 }), { childMonth: true });
      this.nextMonth = new Month(dt.plus({ months: 1 }), { childMonth: true });
    }
    this.currentDay = dt.day;
    this._days = this.getDays();
    const start = options && options.hasOwnProperty('start') ? options.start : null;
    const end = options && options.hasOwnProperty('end') ? options.end : null;

    this.state = NoSelection;

    this.states = {
      hover: null,
      focus: null,
      start: start,
      end: end
    };

    this.hasRange = this.states.start && this.states.end;
  }

  * [Symbol.iterator]() {
    for (let i=0; i<this._days.length; i++) {
      yield this._days[i];
    }
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

    let month = [];
    for (let i = 0; i < 42; i++) {
      month.push(new Day(currentDay, this.dt));
      currentDay = currentDay.plus({day: 1});
    }
    return month;
  }

  getDay(dateTime) {
    const match = this._days.filter(({dt}) => dt.hasSame(dateTime, 'day'));
    return match.length ? match[0] : null;
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
  }

  inRange(dt) {
    let { start, end } = this.states;
    if (!start || !end) {
      return false;
    }

    return (dt.diff(start.dt).toObject().milliseconds > 0 && dt.diff(end.dt).toObject().milliseconds < 0);
  }
}