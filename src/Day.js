export default class Day {
  constructor(dt, currentDay) {
    this.dt = dt;
    this.ts = dt.ts;
    // TODO: check this
    const diff = dt.diff(currentDay, 'days').toObject();
    this.inMonth = dt.month === currentDay.month;
    this.isPastDay = (diff < 0);
    this.isCurrentDay = dt.hasSame(currentDay, 'day');
    this.formatted = dt.day;
    this.isInRange = false;
  }

}