import { DateTime } from 'luxon';
import Month from './Month';

export default class Calendar {
  constructor(dt = DateTime.local(), start = null, end = null, opts = null) {
    this.dt = dt;
    this.currentDate = DateTime.local();
    this.start = start || this.currentDate;
    this.end = end || this.currentDate.plus({day: 1});
    this.restrictedDates = null;

    if (opts) {
      if (opts.hasOwnProperty('restrictedDates')) {
        this.restrictedDates = opts.restrictedDates;
      }
    }

    this.setMonths(dt);
  }

  nextMonth() {
    this.dt = this.dt.plus({month: 1});
    this.setMonths();
  }

  prevMonth() {
    this.dt = this.dt.minus({month: 1});
    this.setMonths();
  }

  setMonths() {
    let monthOpts = {
      start: this.start,
      end: this.end,
      restrictedDates: this.restrictedDates
    };

    this.lastMonth = new Month(this.dt.minus({month: 1}), monthOpts);
    this.month = new Month(this.dt, monthOpts);
    this.upcommingMonth = new Month(this.dt.plus({month: 1}), monthOpts);
  }

  selectDay(dt, type, field) {
    if (this.lastMonth.hasDay(dt)) {
      this.lastMonth.selectDay(dt, type, field);
    }
    let newDays = this.month.selectDay(dt, type, field);
    this.start = newDays.start;
    this.end = newDays.end;
    if (this.upcommingMonth.hasDay(dt)) {
      this.upcommingMonth.selectDay(dt, type, field);
    }
  }
}