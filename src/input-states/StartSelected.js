import Types from './StartSelectedTypes';

export default {
  name: 'StartSelected',

  selectDay(month, day, type, field = null) {
    Types[type](month, day, field);
  }
}
