import StartSelected from './StartSelected';

export default {
  Mouse(month, day) {
    const { start } = month.states;
    if (day.ts < start.ts) {
      month.states.start = day;
      return;
    }

    if (day.ts > start.ts) {
      month.states.start = day;
      month.states.end = null;
      month.state = StartSelected;
    }
  },

  Manual(month, day, field) {
    switch (field) {
      case 'start':
        if (day.ts < month.states.end) {
          month.states.end = day;
        } else {
          month.states.start = day;
          month.states.end = null;
        }
        break;
      case 'end':
        if (month.states.start && day.ts > month.states.start.ts) {
          month.states.end = day;
        }
        break;
    }
  }
};