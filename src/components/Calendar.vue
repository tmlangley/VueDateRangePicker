<template>

  <div class="calendar">
    <div class="weekdays">
      <div class="weekday" v-for="(weekday, i) in weekdays" :key="i">
        {{weekday}}
      </div>
    </div>
    <div class="days" v-on:mouseenter="setActive" v-on:mouseleave="setInactive">
      <div
        v-on:click.prevent="select(day.date)"
        v-on:mouseenter="hover(day.date)"
        v-for="(day, index) in month"
        :key="index" class="day"
        :ref="`day_${index}`"
        :class="{
        selected: (startDate && startDate.hasSame(day.date, 'day'))
        || (endDate && endDate.hasSame(day.date, 'day')),
        range: range ? isInRange(day.date) : '',
        notInMonth: midMonth.month !== day.date.month,
        currentDay: currentDay.hasSame(day.date, 'day'),
        focus: focusIndex && focusIndex === index
      }"
      >
        {{day.displayDay}}
      </div>
    </div>
  </div>
</template>

<script>
  import { DateTime } from 'luxon';
  export default {
    name: "calendar",
    data() {
      return {
        startDate: null,
        endDate: null,
        hoverDate: null,
        isActive: false,
        selectedDates: [],
        currentDay: DateTime.local(),
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      }
    },
    computed: {
      midMonth() {
        return this.month[15].date;
      }
    },
    props: {
      month: {
        type: Array
      },
      range: {
        type: Boolean
      },
      start: {
        type: Object
      },
      end: {
        type: Object
      },
      focusIndex: {
        type: Number
      }
    },

    watch: {
      start(newVal) {
        this.startDate = newVal;
      },

      end(newVal) {
        this.endDate = newVal;
      },

      startDate(newVal) {
        this.$emit('startDateChanged', newVal);
      },

      endDate(newVal) {
        this.$emit('endDateChanged', newVal);
      },

      focusIndex(newVal) {
        this.$emit('focusChanged', this.month[newVal].date);
      }
    },

    methods: {
      moveFocus(e, index) {
        let nextFocus = null;

        switch (e.keyCode) {
          case 37: // Left arrow
            if (index > 0) {
              nextFocus = index-1;
            }
            break;
          case 38: // Up arrow
            if (index > 6) {
              nextFocus = index - 7;
            }
            break;
          case 39: // Right arrow
            if (index < 41) {
              nextFocus = index+1;
            }
            break;
          case 40: // Down arrow
            if (index < 35) {
              nextFocus = index + 7;
            }
            break;
        }

        if (nextFocus !== null) {
          this.focusIndex = nextFocus;
        }
      },

      select(date) {
        if (this.range && this.startDate && !this.endDate && date.ts > this.startDate.ts) {
          this.endDate = date;
        } else {
          this.startDate = date;
          this.endDate = null;
        }
      },

      hover(date) {
        this.hoverDate = date;
      },
      setActive() {
        this.isActive = true;
      },
      setInactive() {
        this.isActive = false;
      },

      isInRange(date) {
        return (this.startDate && this.startDate.ts < date.ts && !date.hasSame(this.startDate, 'day'))
          && (
            this.endDate && this.endDate.ts > date.ts && !date.hasSame(this.endDate, 'day')
            || (this.hoverDate && !this.endDate && this.hoverDate.ts > date.ts && !date.hasSame(this.hoverDate, 'day'))
          );
      }
    }
  }
</script>

<style scoped>
  .calendar {
    max-width: 500px;
    width: 100%;
  }


  .weekdays,
  .days {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
  }

  .weekday {
    flex: 1;
    width: 14.285714286%;
    flex-basis: 14.285714286%;
    text-align: center;
    padding: 5px 0;
  }

  .day {
    flex: 1;
    width: 14.285714286%;
    flex-basis: 14.285714286%;
    padding: 7px 0;
    touch-action: manipulation;
    background: #fff;
    appearance: none;
    cursor: pointer;
  }

  .currentDay {
    background: #ddd;
  }

  .range {
    background: slategray;
    color: #fff;
  }

  /*.selected.range ~ .selected ~ .notInMonth,*/
  .notInMonth {
    color: #999;
  }

  .day.selected {
    background: teal;
    color: #fff;
  }

  .day.focus {
    outline: 0 none;
    background: #00c3c3;
  }

  .day:hover {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1) inset;
  }

</style>