export default class Day {
  constructor(dt, currentDay, month) {
    this.key = Day.getKey(dt, month);
    this.dt = dt;
    this.ts = dt.ts;
    // TODO: check this
    const diff = dt.diff(currentDay, 'days').toObject();
    this.inMonth = dt.month === month;
    this.isPastDay = (diff < 0);
    this.isCurrentDay = dt.hasSame(currentDay, 'day');
    this.formatted = dt.day;
    this.isInRange = false;
  }


  static getKey(dt, month) {
    return `${dt.toISODate()}_${month}`;
  }
}