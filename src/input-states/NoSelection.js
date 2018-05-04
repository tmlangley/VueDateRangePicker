import Types from './NoSelectionTypes';
import StartSelected from './StartSelected';

export default {
  name: 'NoSelection',

  selectDay(month, day, type, field = null) {
    Types[type](month, day);
    month.state = StartSelected;
  }
}
