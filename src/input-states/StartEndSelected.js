import Types from './StartEndSelectedTypes';

export default {
  name: 'StartEndSelected',

  selectDay(month, day, type, field = null) {
    Types[type](month, day, field);
  }
}
