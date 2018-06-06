export default class Day {
  constructor(dt, currentDay, month, isRestricted) {
    this.key = Day.getKey(dt, month);
    this.dt = dt;
    this.ts = dt.ts;
    this.inMonth = dt.month === month;
    this.isCurrentDay = dt.hasSame(currentDay, 'day');
    this.formatted = dt.day;
    this.isInRange = false;
    this.isRestricted = isRestricted;
  }


  static getKey(dt, month) {
    return `${dt.toISODate()}_${month}`;
  }
}