import StartEndSelected from './StartEndSelected';

export default {
  Mouse(month, day) {
    const { start } = month.states;
    if (day.ts > start.ts) {
      month.states.end = day;
      month.state = StartEndSelected;
    } else {
      month.states.start = day;
    }
  },

  Manual(month, day, field) {
    switch (field) {
      case 'start':
        month.states.start = day;
        break;
      case 'end':
        if (month.states.start && day.ts > month.states.start.ts) {
          month.states.end = day;
          month.state = StartEndSelected;
        }
        break;
    }
  }
};